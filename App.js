// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chat from './components/Chat';
import Start from './components/Start';
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { LogBox, Alert } from 'react-native';
// NetInfo for network check
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from 'react';
//import for images in firestore
import { getStorage } from "firebase/storage";

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  // Check the connection status
  const connectionStatus = useNetInfo();
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);  // The effect runs whenever the connection status changes


  //  web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD5yLs2OjUTSQkx61udS1D8L_xh2AH4ZA0",
    authDomain: "chatapp-1a201.firebaseapp.com",
    projectId: "chatapp-1a201",
    storageBucket: "chatapp-1a201.appspot.com",
    messagingSenderId: "695897265615",
    appId: "1:695897265615:web:a7d2cb2c3298fd85682eba"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  // Initialize Firebase Storage handler
  const storage = getStorage(app);

  // Wrap the app in the NavigationContainer to manage navigation state
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Home"
          component={Start}
        />
        <Stack.Screen
          name="Chat">
          {props => <Chat isConnected={connectionStatus.isConnected}
            db={db}
            storage={storage}
            {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
