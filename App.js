import React, {useEffect, useState, Component} from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, signInWithCustomToken, AuthCredential, getIdToken} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import firebaseConfig from './src/firebase-config';
import { Sectors, AddSector, LoginScreen, HomeScreen, TaskScreen, AddTasks, AssignTaskScreen} from "./src/screens"





const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const Stack = createNativeStackNavigator();






export default function App() {

 

  return (
    
    <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen name = "Login" component = {LoginScreen}/>
            <Stack.Screen name = "appLimpieza" component = {HomeScreen}/>
            <Stack.Screen name = "Sectors" component = {Sectors}/>
            <Stack.Screen name = "AddSector" component = {AddSector} />
            <Stack.Screen name = "Tasks" component = {TaskScreen} />
            <Stack.Screen name = "Agregar Tarea" component = {AddTasks} />
            <Stack.Screen name = "Asignar Tarea" component = {AssignTaskScreen} />
         </Stack.Navigator>
            
          
    </NavigationContainer>
    
  );
  }



