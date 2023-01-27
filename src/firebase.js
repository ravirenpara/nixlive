import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDOI87Fe0dVk4G5IfGNWkb7v7SRoYWXNU0",
  authDomain: "nix-dec-2022.firebaseapp.com",
  projectId: "nix-dec-2022",
  storageBucket: "nix-dec-2022.appspot.com",
  messagingSenderId: "369443757975",
  appId: "1:369443757975:web:6a4daed904de4de7fceed2",
  measurementId: "G-254P4ZGBD1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;