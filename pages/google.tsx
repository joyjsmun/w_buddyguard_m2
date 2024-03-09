// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCVaHnYboccQhOTXTL3O-k8O5dQXfXyspk",
  authDomain: "buddyguard-26449.firebaseapp.com",
  projectId: "buddyguard-26449",
  storageBucket: "buddyguard-26449.appspot.com",
  messagingSenderId: "1084609737424",
  appId: "1:1084609737424:web:c7947f3cea045ede0b64d5",
};

const GooglePage = () => {
  return (
    <div>
      <h1>Google Page</h1>
      {/* Add your content here */}
    </div>
  );
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export default GooglePage;
