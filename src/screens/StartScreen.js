import React, { useEffect, useRef, useState } from 'react'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { Alert, SafeAreaView, Text, View } from 'react-native';
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import { doc, getFirestore, updateDoc } from 'firebase/firestore'


const db = getFirestore(app);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default function StartScreen({ navigation }) {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });


async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      alert('Permiso de notificaciones otorgado');
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });
    token = token.data
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}



  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        let t = ""
        await registerForPushNotificationsAsync().then(token => t = token);

        const saveToken = async (token) => {
          let ref = doc(db, "user", user.uid);
            await updateDoc(ref, {
              expoPushToken: token,
            });
        }
        if (t){
          saveToken(t)
        }
        navigation.navigate('appLimpieza', {uid: user.uid, uidTask: user.uid, loading: true})
    }
        
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      alert('Received a notification addNotificationReceivedListener');
      setNotification(notification);
    });
  
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      alert('Received a notification addNotificationResponseReceivedListener');
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <SafeAreaView style = {styles.container}>
      <View style = {styles.container}>
        <Logo />
        <Header>appLimpieza</Header>
        <Paragraph>
          Iniciar sesion o registrar usuario
        </Paragraph>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Iniciar Sesion')}
        >
          <Text>Iniciar sesion</Text> 
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Registrarte')}
        >
          <Text>Registrarte</Text> 
        </Button>
      </View>
    </SafeAreaView>
  )
}



