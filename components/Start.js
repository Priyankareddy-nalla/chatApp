
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';

const Start = ({ navigation }) => {
  // State to store the user's name
  const [name, setName] = useState('');
  // State to store the selected background color
  const [selectedColor, setSelectedColor] = useState(null);
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  // Function to navigate to chat screen with name and background color
  const handleStartChatting = () => {
    navigation.navigate('Chat', { name: name, backgroundColor: selectedColor });
  };

  // Function to change chat screen background color
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={require('../assets/BackgroundImage.png')}
        resizeMode='cover'>
        <Text style={styles.title}>HappyTalk</Text>
        <View style={styles.contentBox}>
          <View style={styles.changeDiv}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder='Enter Your Name'
            />
            <View style={styles.box}>
              <Text style={styles.backgroundColorText}>Choose background color</Text>
              <View style={styles.colorPicker}>
                {colors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.colorOption, { backgroundColor: color }]}
                    onPress={() => handleColorChange(color)}
                    accessible={true}
                    accessibilityLabel={`Select ${color} color`}
                    accessibilityHint={`Changes the background color to ${color}`}
                    accessibilityRole="button"
                  />
                ))}
              </View>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartChatting}
              >
                <Text style={styles.startButtonText}>Start Chatting</Text>
              </TouchableOpacity>
              {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
            </View>
          </View>
        </View>
      </ImageBackground>

    </View>

  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 150,
    color: 'white'
  },
  changeDiv: {
    width: '90%',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  box: {
    width: '100%',
    alignItems: 'center',
  },
  backgroundColorText: {
    fontSize: 16,
    marginBottom: 10,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
    borderWidth: 2,
  },
  startButton: {
    backgroundColor: '#757083',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingTop: 10,
    paddingRight: 55,
    paddingBottom: 10,
    paddingLeft: 55,
  },
});

export default Start;
