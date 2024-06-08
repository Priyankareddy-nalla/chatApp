# ChatApp
Chat app for mobile devices using React Native. The app will provide users with a chat interface and options to share images and their
location.

# Project Description
Chat Application aims to develop a feature-rich, cross-platform chat app using React Native. The application will provide users with 
a seamless chat interface, allowing them to send and receive messages, share images, and share their current location. This project leverages 
the versatility and efficiency of React Native to ensure a smooth and responsive user experience on both iOS and Android devices.

# Technologies Used
* Framework: Developed using React Native and Expo.
* Styling: Styled according to the provided screen design.
* Database: Chat conversations stored in Google Firestore Database.
* Authentication: Users authenticated anonymously via Google Firebase authentication.
* Image Storage: Images stored in Firebase Cloud Storage.
* Location Services: Access the user's location data for sharing in chat messages.
* Audio Storage: Audio files stored in Firebase Cloud Storage.
* Chat Interface: Utilizes the Gifted Chat library for chat interface and functionality.
* Codebase: Well-commented codebase to enhance readability and maintainability.

# Setup Instructions
## Development Environment
npm install -g expo-cli

# Libraries Installation
Project Dependencies:
* npm install
* expo install @react-navigation/native
* expo install firebase
* npm install react-native-gifted-chat
* expo install expo-av

# Getting Started
To get started with ChatApp, follow these steps:
1. Clone this repository to your local machine.
2. Follow the setup instructions mentioned above.
3. Start the Expo development server: 
 expo start or npm start
4. Follow the Expo CLI instructions to run the app on your preferred device/emulator.

# How to Use ChatApp
Once the app is running on your device/emulator, follow these steps to use ChatApp:
1. Enter Name and Choose Background Color:
* Enter your name in the input field.
* (Optional) Select your desired background color.
* Click on the "Start Chatting" button.
2. Send Messages:
* Type your message in the text input field.
* Press "Send" to send messages to your contacts.
3. Share Images:
* Click on the "+" icon.
* Select an image from your device's library or capture a new one with the camera.
4. Share Location:
* Click the "Send Location" button.
* Your current location will be shared and displayed in a map view within the chat.
5. Record and Send Audio:
* Click the "Record Audio" button.
* Record your audio message and send it.
6. Read Messages Offline:
* Messages are stored locally.
* You can read conversations offline and revisit them anytime.
