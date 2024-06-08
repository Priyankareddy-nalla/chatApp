
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import PropTypes from 'prop-types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import { Audio } from "expo-av";


const Chat = ({ db, route, navigation, isConnected, storage }) => {
  const { userID, name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let soundObject = null;
  let unsubMessages;
  
  useEffect(() => {
    // Set the title of the navigation bar to the user's name
    navigation.setOptions({ title: name });
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
      // Firestore query to fetch messages ordered by creation time
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubMessages = onSnapshot(q, (snapshot) => {
        try {
          const newMessages = snapshot.docs.map((doc) => ({
            _id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          }));
          cacheMessages(newMessages);
          setMessages(newMessages);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch messages. Please try again later.');
          setLoading(false);
        }
      });
    } else loadCachedMessages();

    return () => {
      if (unsubMessages) unsubMessages();
      if (soundObject) soundObject.unloadAsync();
    };
  }, [isConnected]);

  // Load cached messages from AsyncStorage
  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("chat_app") || [];
    setMessages(JSON.parse(cachedMessages));
  };

  // Cache messages to AsyncStorage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('chat_app', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Handle sending a new message
  const onSend = async (newMessages) => {
    try {
      await addDoc(collection(db, "messages"), newMessages[0]);
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    }
  };

  // Customize the appearance of chat bubbles
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#000',
        },
        left: {
          backgroundColor: '#FFF',
        },
      }}
    />
  );

  // Hide input toolbar when offline
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Render custom action button
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  // Render custom view for location messages
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  // render custom view for  audio
  const renderAudioBubble = (props) => {
    return <View {...props}>
      <TouchableOpacity
        style={{
          backgroundColor: "#FF0", borderRadius: 10, margin: 5
        }}
        onPress={async () => {
          const { sound } = await Audio.Sound.createAsync({
            uri:
              props.currentMessage.audio
          });
          await sound.playAsync();
        }}>
        <Text style={{
          textAlign: "center", color: 'black', padding:
            5
        }}>Play Sound</Text>
      </TouchableOpacity>
    </View>
  }


  // Display a loading message while fetching data
  if (loading) {
    return <View style={[styles.container, { backgroundColor: backgroundColor }]}><Text>Loading...</Text></View>;
  }

  // Display an error message if something goes wrong
  if (error) {
    return <View style={[styles.container, { backgroundColor: backgroundColor }]}><Text>{error}</Text></View>;
  }

  // Render the main chat interface
  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderMessageAudio={renderAudioBubble}
        user={{
          _id: userID,
          name: name,
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}
      {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior='padding' /> : null}
    </View>
  );
};

// Define prop types for the Chat component
Chat.propTypes = {
  db: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  isConnected: PropTypes.bool.isRequired,
  storage: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
