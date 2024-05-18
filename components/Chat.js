import { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

const Chat = ({ route, navigation }) => {
  // Destructure the name and backgroundColor from the route parameters
  const { name, backgroundColor } = route.params;
  console.log(backgroundColor); // debug bg


  // useEffect hook to set the navigation options to the user's name when the component mounts
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    // Set the container's background color to the selected background color
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <Text style={styles.text}>Welcome to HappyTalk {name}!</Text>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
});

export default Chat;
