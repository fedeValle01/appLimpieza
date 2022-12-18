import React, { useEffect, useState } from 'react'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { SafeAreaView, Text, View } from 'react-native';
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, query, onSnapshot, where } from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';


  
export default function StartScreen({ navigation }) {


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [uid, setUid] = useState([]);
  const [name, setName] = useState('');

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
        navigation.navigate('appLimpieza', {uid: user.uid, uidTask: user.uid})
        
        return unsuscribe;
    }
        
    });
    
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
