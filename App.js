import React, { useEffect, useState, Component } from "react";
import {
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import firebaseConfig from "./src/firebase-config";
import registerNNPushToken from 'native-notify';
import { Sectors, AddSector, LoginScreen, HomeScreen, UserScreen, AdminScreen, TaskScreen, RegisterScreen, AddTasks, AssignTaskScreen, StartScreen, HistorialScreen, TestScreen
} from "./src/screens";
import Button from "./src/components/Button";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const Stack = createNativeStackNavigator();

function LogoTitle() {
  return (
    <Image
      style={{ width: 0, height: 0 }}
      source={require("./src/assets/home.png")}
    />
  );
}

export default function App() {
  registerNNPushToken(6675, '3kduimkhyzTBMa3MrtOgiq');
  return (
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

        <Stack.Screen name="Sectors" component={Sectors} />
        <Stack.Screen name="AddSector" component={AddSector} />
        <Stack.Screen name="Tasks" component={TaskScreen} />
        <Stack.Screen name="TestScreen" component={TestScreen} />

        
        <Stack.Screen
          name="Agregar Tarea"
          component={AddTasks}
          options={({ navigation, route }) => ({
            title: "Crear nueva tarea",
          })}
        />
        <Stack.Screen name="Asignar Tareas" component={AssignTaskScreen} />
        <Stack.Screen
          name="HistorialScreen"
          component={HistorialScreen}
          options={({ navigation, route }) => ({
            title: "Historial",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
