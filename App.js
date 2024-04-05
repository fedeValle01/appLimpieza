import React, { useEffect, useState, Component, useRef } from "react";
import { StyleSheet, Text, Image, SafeAreaView, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { doc, setDoc, getFirestore } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import firebaseConfig from "./src/firebase-config";
import { Sectors, AddSector, LoginScreen, HomeScreen, UserScreen,
AdminScreen, TaskScreen, RegisterScreen, AddTasks, AssignTaskScreen, AutoAssignTaskScreen, StartScreen, HistorialScreen,
 TestScreen, TasksScreen, StockScreen, ProductsScreen, StockBuysScreen
} from "./src/screens";
import { MenuProvider } from 'react-native-popup-menu';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const Stack = createNativeStackNavigator();
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

function LogoTitle() {
  return (
    <Image
      style={{ width: 0, height: 0 }}
      source={require("./src/assets/home.png")}
    />
  );
}

export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {

    async function schedulePushNotification() {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "ClosedApp",
          body: 'Here is the notification body',
          data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
      });
    }
    TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
      console.log('Received a notification in the background!');
      schedulePushNotification();
      Alert.alert('Received a notification in the background!');
    });

    Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
      }, []);
  
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="Iniciar Sesion" component={LoginScreen} />
          <Stack.Screen name="Registrarte" component={RegisterScreen} />
          <Stack.Screen 
            name="appLimpieza"
            component={HomeScreen}
            options={({ navigation, route }) => ({
              headerBackVisible: false,
              headerTitle: (props) => <LogoTitle {...props} />,
              // Add a placeholder button without the `onPress` to avoid flicker
            })}
          />
          <Stack.Screen name="Usuarios" component={UserScreen} />
          <Stack.Screen
            name="Admin"
            component={AdminScreen}
          />
          <Stack.Screen name="Stock" component={StockScreen} />
          <Stack.Screen name="Lista de Productos" component={ProductsScreen} />
          <Stack.Screen name="Compras" component={StockBuysScreen} />
          <Stack.Screen name="Sectors" component={Sectors} />
          <Stack.Screen name="AddSector" component={AddSector} />
          <Stack.Screen name="Tasks" component={TaskScreen} />
          <Stack.Screen name="TestScreen" component={TestScreen} />
          <Stack.Screen name="Tareas" component={TasksScreen} />

          
          <Stack.Screen
            name="Agregar Tarea"
            component={AddTasks}
            options={({ navigation, route }) => ({
              title: "Crear nueva tarea",
            })}
          />
          <Stack.Screen name="Asignar Tareas" component={AssignTaskScreen} />
          <Stack.Screen name="Asignar Tareas Automaticamente" component={AutoAssignTaskScreen} />
          <Stack.Screen
            name="HistorialScreen"
            component={HistorialScreen}
            options={({ navigation, route }) => ({
              title: "Historial",
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
