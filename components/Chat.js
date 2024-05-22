import { useState, useEffect } from 'react';
import { StyleSheet, View,Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params;
  console.log(backgroundColor); // debug bg
  const [messages, setMessages] = useState([]);
  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }
  // useEffect hook to set the navigation options to the user's name when the component mounts
  useEffect(() => {
    navigation.setOptions({ title: name });
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          Avtar: "",
        },
      },
      {
        _id: 2,
        text: 'you’ve entered the chat room',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  //renders chat for color and postion 
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }


  return (
    // Set the container's background color to the selected background color
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
    </View>

  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
});

export default Chat;
