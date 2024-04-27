import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore  } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import firebaseConfig from '../firebase-config';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
