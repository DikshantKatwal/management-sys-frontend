// firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBEAHcs3UYNNFmh8LMA6zpr2oKJjXIz9oZ4",
  authDomain: "applynote-bc4cd.firebaseapp.com",
  projectId: "applynote-bc4cd",
  storageBucket: "applynote-bc4cd.firebasestorage.app",
  messagingSenderId: "1068678210566",
  appId: "1:1068678210566:web:dd21258d80d9a9fa0acf87",
};

const app = initializeApp(firebaseConfig);

export const getFirebaseMessaging = async () => {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) return null;

  return getMessaging(app);
};

export const generateToken = async () => {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  const token = await getToken(messaging, {
    vapidKey:
      "BCVbVA7Ek9jFgUEK038ilDdLn83QZAkBCZ9k64FRC5dc3DNDmr97Se0e7K04Kb0C--WRFfh2TMw6NnGJSnKFpuU",
  });

  console.log("FCM token ✅", token);
  return token;
};
