import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import PropTypes from 'prop-types';

const Chat = ({ db, route, navigation }) => {
  const { userID, name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({ title: name });
    //Firestore query 
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    // real-time listener
    const unsubMessages = onSnapshot(q, (snapshot) => {
      try {
        const newMessages = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        }));
        setMessages(newMessages);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch messages. Please try again later.');
        setLoading(false);
      }
    });

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

  const onSend = async (newMessages) => {
    try {
      await addDoc(collection(db, "messages"), newMessages[0]);
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    }
  }

  // Renders chat for color and position 
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

  if (loading) {
    return <View style={[styles.container, { backgroundColor: backgroundColor }]}><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View style={[styles.container, { backgroundColor: backgroundColor }]}><Text>{error}</Text></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderBubble={renderBubble}
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

//Prop types
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
