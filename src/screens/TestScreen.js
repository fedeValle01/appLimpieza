import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import firebaseConfig from "../firebase-config";
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import * as TaskManager from 'expo-task-manager';
import Constants from "expo-constants";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  alert('Received a notification in the background!');
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);



export default function TestScreen({ navigation, route }) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [token1, setToken1] = useState('ExponentPushToken[zKXoTSJcDXBpl22NHavNwP]');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

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


  const saveToken = async () => {
    let ref = doc(db, "user", route.params.uid);
      await updateDoc(ref, {
        expoPushToken: expoPushToken,
      });
  }
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
      <Button
        title="Enviar notificacion a ExponentPushToken[ss8OLVOw9CDDJK0p90UNBF]"
        onPress={async () => {
          // ExponentPushToken[1FY5jAMZtjVxrm_K0NJ9Jm]       Expo Go
          // ExponentPushToken[ss8OLVOw9CDDJK0p90UNBF]       Physical Device
          await sendPushNotification('ExponentPushToken[1FY5jAMZtjVxrm_K0NJ9Jm]');
        }}
      />

      <Button title="Save expoPushToken" onPress={saveToken}/>

    </View>
    
  );
} 

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

async function sendPushNotification(token1) {
  const message = {
    to: token1,
    sound: 'default',
    title: 'Notificacion de prueba',
    body: 'Hola!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

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
