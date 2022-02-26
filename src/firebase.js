
import firebase from "firebase/app";
import 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCh9LhhgUe3_qni5YVy4Yl4sjM2gt1ZwPQ",
  authDomain: "crud-react-tareas-firebase.firebaseapp.com",
  databaseURL: "https://crud-react-tareas-firebase.firebaseio.com",
  projectId: "crud-react-tareas-firebase",
  storageBucket: "crud-react-tareas-firebase.appspot.com",
  messagingSenderId: "279863980816",
  appId: "1:279863980816:web:b5b1d7aa03fd7453a9eb95"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export {firebase}