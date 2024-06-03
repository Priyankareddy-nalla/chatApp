import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import PropTypes from 'prop-types';
import AsyncStorage from "@react-native-async-storage/async-storage";


const Chat = ({ db, route, navigation, isConnected }) => {
  const { userID, name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let unsubMessages;
  useEffect(() => {
    // Set the title of the navigation bar to the user's name
    navigation.setOptions({ title: name });
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();// Unsubscribe from any previous listeners
      unsubMessages = null;
      // Firestore query to fetch messages ordered by creation time
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      // Set up real-time listener for Firestore messages collection
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
    } else loadCachedMessages();   // Load cached messages if offline

    // Clean up listener on component unmount or when isConnected changes
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);


  // Load cached messages from AsyncStorage
  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("chat_app") || [];
    setMessages(JSON.parse(cachedMessages));
  }

  // Cache messages to AsyncStorage
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('chat_app', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }


  // Handle sending a new message
  const onSend = async (newMessages) => {
    try {
      await addDoc(collection(db, "messages"), newMessages[0]);
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    }
  }

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

  // Customize the input toolbar based on connection status
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
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
        onSend={(messages) => onSend(messages)}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
