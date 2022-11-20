import React, {useEffect, useState, Component} from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, signInWithCustomToken, AuthCredential, getIdToken} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../firebase-config';
import styles from '../screens/stylesScreens';

export default function LoginScreen({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [UserCredential, setUserCredential] = useState('');
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  

  const handeCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((UserCredential) =>{
      console.log('Cuenta con email '+email+ 'creada ');
      setUser(user);
      setUserCredential(UserCredential);
    })
    .catch(error => {
      alert(error);
      
    })
  }
  const handeSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((UserCredential) =>{
      console.log('Ingresado');
      console.log(user);
      setUser(user);
      setUserCredential(UserCredential);
      console.log('UserCredential: '+UserCredential+ ' user: '+user);
      navigation.navigate("Home");
    })
    .catch(error => {
      alert(error);
    })
  }
  const helloAlert = () => {
      alert("Hello World!");
  }
  const viewCred = () => {
    alert("Cred: "+ auth);
  }

const logInWithCred = async () => {
  signInWithEmailAndPassword(auth, email, password)
    .then((UserCredential) =>{
      console.log('Ingresado');
      console.log(user);
      setUser(user);
      setUserCredential(UserCredential);
      console.log('UserCredential: '+UserCredential+ ' user: '+user);
      navigation.navigate("Home");
    })
    .catch(error => {
      alert(error);
    })

  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(function(idToken) {  
        });
    }
        console.log("ya tienes sesión iniciada con:", user.email+ ' cred: '+ UserCredential);
        setEmail(user.email);
        setPassword(user.password);
      //   signInWithCustomToken(user.getIdToken()).then(() => {
      //   console.log('ingreso por token');
      //   navigation.navigate("Home");
      // })
      
    });
  }, []);

  return (
    
    <SafeAreaView style = {styles.container}>
      <Text>Login Screen</Text>
      <Text style={{color: "red"}}>E-mail</Text>
      <TextInput placeholder='emailc' onChangeText = {(text) => setEmail(text)}></TextInput>
      <Text style={{color: "red"}}>Password</Text>
      
      <TextInput placeholder='Password' secureTextEntry={true} onChangeText = {(text) => setPassword(text)}></TextInput>
      

      <TouchableOpacity onPress={handeSignIn}>
        <Text>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handeCreateAccount}>
        <Text>Crear cuenta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={helloAlert}>
        <Text>Alerta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={viewCred}>
        <Text>viewCred</Text>
      </TouchableOpacity>  
      <TouchableOpacity onPress={logInWithCred}>
        <Text>logInWithCred</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {navigation.navigate('Sectors', {email: email})}}>
        <Text>Ver sectores</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
