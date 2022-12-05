import React, {useEffect, useState, Component} from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setUserCredential, signInWithCredential, getIdToken} from 'firebase/auth'
import { doc, setDoc, getFirestore, collection, query, onSnapshot, orderBy, where, getDocs } from "firebase/firestore"; // Follow this pattern to import other Firebase services
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
  const [uid, setUid] = useState([]);
  const [UserCredential, setUserCredential] = useState([]);
  
  
  const createUser = async (uid) =>{
    await setDoc(doc(db, 'user', uid), {
      username: name,
      uid: uid,
    });
  }


  const handeCreateAccount = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
    .then((UserCredential) =>{
      console.log('Cuenta con email '+email+ 'creada ');
      setUser(user);
      let uid = UserCredential.user.uid;
      createUser(uid);
      navigation.navigate("Home", {uid: uid});
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
  

const viewName = () => {
    if(uid!=""){
      uid.forEach((uid) => {
        setName(uid.username);
        // console.log('name: '+name);
      });
  }
}

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("ya tienes sesión iniciada con: "+name+', UID: '+user.uid);
        
        const collectionRef = collection(db, 'user');
        const q = query(collectionRef, where("uid", "==", user.uid));
        const unsuscribe = onSnapshot(q, querySnapshot =>{
          setUid(
            querySnapshot.docs.map(doc =>({
              username: doc.data().username,
            }
            ))
          )
          
        })
        navigation.navigate('Home', {uid: user.uid})
        
        return unsuscribe;
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
      <TouchableOpacity onPress={viewName}>
        <Text>Ver nombre con uid</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {navigation.navigate('Sectors', {name: name})}}>
        <Text>Ver sectores</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}