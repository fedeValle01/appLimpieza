import React, {useEffect, useState, Component} from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setUserCredential, signInWithCredential, getIdToken} from 'firebase/auth'
import { doc, setDoc, getFirestore } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);



export default function LoginScreen({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');

  
  const createUser = async (uid) =>{
    await setDoc(doc(db, 'user', uid), {
      username: name
    });
  }


  const handeCreateAccount = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
    .then((UserCredential) =>{
      console.log('Cuenta con email '+email+ 'creada ');
      setUser(user);
      setUserCredential(UserCredential);
      let uid = UserCredential.user.uid;
      createUser(uid);
    })
    .catch(error => {
      alert(error);
    })
    
    
  }
  const handeSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((UserCredential) =>{
      console.log('Ingresado');
      console.log('UserCredential: '+UserCredential.user.uid+ ' user: '+user);
      let uid = UserCredential.user.uid;
      navigation.navigate("Home", {uid: uid});
    })
    .catch(error => {
      alert(error);
    })
  }
  const helloAlert = () => {
      alert("Hello World!");
  }
  

const logInWithCred = async () => {
  signInWithEmailAndPassword(auth, email, password)
    .then((UserCredential) =>{
      console.log('Ingresado');
      console.log(user);
      setUser(user);
      setUserCredential(UserCredential);
      console.log('UserCredential: '+UserCredential+ ' user: '+user);
    })
    .catch(error => {
      alert(error);
    })

  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("ya tienes sesión iniciada con: "+name+', UID: '+user.uid);
        navigation.navigate('Home', {uid: user.uid})
    }
        
    });
  }, []);

  return (
    
    <SafeAreaView style = {styles.container}>
      <Text>Login Screen</Text>
      <Text style={{color: "red"}}>Nombre</Text>
      <TextInput placeholder='Nombre' onChangeText = {(text) => setName(text)}></TextInput>
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
      <TouchableOpacity onPress={logInWithCred}>
        <Text>logInWithCred</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {navigation.navigate('Sectors', {name: name})}}>
        <Text>Ver sectores</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
