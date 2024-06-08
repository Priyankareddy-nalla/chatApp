// Importing necessary modules and components
import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert, Button } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Audio } from 'expo-av';

// CustomActions component definition
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  // Initialize ActionSheet hook
  const actionSheet = useActionSheet();
  let recordingObject = null;

  useEffect(() => {
    return () => {
      if (recordingObject) recordingObject.stopAndUnloadAsync();
    }
  }, []);

  // Function to handle action button press
  const onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Record Audio', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        textStyle: {
          color: 'blue',
          fontSize: 16,
          textAlign: 'center',
          paddingVertical: 10,
        },
        cancelButtonTintColor: 'red',
      },

      // Handle user selection
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto()
            return;
          case 2:
            getLocation();
            return;
          case 3:
            startRecording();
            return;
          default:
        }
      },
    );
  };



  // Function to upload and send an image
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    // Upload image to Firebase Storage
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref);
      onSend({ image: imageURL });
    });
  };

  // Function to pick an image from the device's library
  const pickImage = async () => {
    // Request permission to access media library
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  // Function to take a photo using the device's camera
  const takePhoto = async () => {
    // Request permission to access camera
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions.granted) {
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) await uploadAndSendImage(result.assets[0].uri);
      else Alert.alert("Permissions haven't been granted.");
    }
  };

  // Function to generate a unique reference for storage
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split('/').pop();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  // Function to get current location
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert("Error occurred while fetching location");
    } else Alert.alert("Permissions haven't been granted.");
  };

  // Function to record audio
  const startRecording = async () => {
    try {
      let permissions = await Audio.requestPermissionsAsync();
      if (permissions?.granted) {
        // iOS specific config to allow recording on iPhone devices
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY).then(results => {
          return results.recording;
        }).then(recording => {
          recordingObject = recording;
          Alert.alert('You are recording...', undefined, [
            { text: 'Cancel', onPress: () => { stopRecording() } },
            {
              text: 'Stop and Send', onPress: () => {
                sendRecordedSound()
              }
            },
          ],
            { cancelable: false }
          );
        })
      }
    } catch (err) {
      Alert.alert('Failed to record!');
    }
  }


  // Function to stop recording
  const stopRecording = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false
    });
    await recordingObject.stopAndUnloadAsync();
  }

  // Function to send recorded audio
  const sendRecordedSound = async () => {
    await stopRecording()
    const uniqueRefString =
      generateReference(recordingObject.getURI());
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(recordingObject.getURI());
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const soundURL = await getDownloadURL(snapshot.ref)
      onSend({ audio: soundURL })
    });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.wrapper, wrapperStyle]} onPress={onActionPress}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for CustomActions component
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 20,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;
