// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chat from './components/Chat';
import Start from './components/Start';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { LogBox } from 'react-native';

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
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
          {props => <Chat db={db} {...props} />}

        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
