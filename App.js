import React, {useEffect, useState, Component} from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, signInWithCustomToken, AuthCredential, getIdToken} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import firebaseConfig from './firebase-config';
import Sectors from './src/screens/sector';
import LoginScreen from './src/screens/logIn';
import HomeScreen from './src/screens/home';




const app = initializeApp(firebaseConfig);
const db = getFirestore(app);





//-----------SCREEN TASKS--------------

function Tasks(navigation){

  return(
  <SafeAreaView style = {styles.container}>
    <Text>Taks</Text>
  </SafeAreaView>
  );
}
const Stack = createNativeStackNavigator();

export default function App() {
  

  return (
    <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen name = "Login" component = {LoginScreen}/>
            <Stack.Screen name = "Home" component = {HomeScreen}/>
            <Stack.Screen name = "Sectors" component = {Sectors}/>
            <Stack.Screen name = "Tasks" component = {Tasks}/>
         </Stack.Navigator>
            
          
    </NavigationContainer>
    
  );
}