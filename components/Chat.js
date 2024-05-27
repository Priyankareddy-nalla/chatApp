import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';

const Chat = ({ db, route, navigation }) => {
  const { userID, name, backgroundColor } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: name });
    //Firestore query 
    const q = query(collection(db, 'messages'),orderBy('createdAt', 'desc'));
    // real-time listener
    const unsubMessages = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: new Date(doc.data().createdAt.toMillis()),
      }));
      setMessages(newMessages);
    });

    // Clean code
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }
  
  //renders chat for color and postion 
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
