import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, TextInput, TouchableOpacity, Alert, View, ScrollView, FlatList } from 'react-native';
import { doc, setDoc, getFirestore, collection, orderBy, onSnapshot, query } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, getIdToken, signOut} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';
import ListGroup from 'react-bootstrap/ListGroup';

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
 
export default function HomeScreen({navigation, route}) {

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [sectors, setSectors ] = useState([]);

  const irACrearSector = () =>{
    if (route.params.uid == 'UDUaYCyuVJYCTP7Y21DJ7ylD8aO2'){
      console.log('Estamos ante el creador');
      navigation.navigate('AddSector', {uid: route.params.uid});
    }
    else alert('solo admin');
  }



    const logOut = () =>{
      const auth = getAuth();
      signOut(auth).then(() => {
        alert('Session cerrada');
        navigation.navigate('Login');
      }).catch((error) => {
        alert(error);
      });
    }
    

    useEffect(() => {

      const collectionRef = collection(db, 'sectors');
      const q = query(collectionRef, orderBy('sector_name', 'asc'))
  
      const unsuscribe = onSnapshot(q, querySnapshot =>{
        setSectors(
          querySnapshot.docs.map(doc =>({
            key: doc.data().sector_name,
            sector_description: doc.data().sector_description,
          }))
        )
      })
      

      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("ya tienes sesión iniciada con:"+route.params.uid); 
      }
      return unsuscribe;
      });
    }, []);
  


    // Return HomeScreen
    return (
      <SafeAreaView style = {styles.container}>
        
        <TouchableOpacity onPress={logOut}>
          <Text>Cerrar sesion</Text>
        </TouchableOpacity>
        <Text>Ver {route.params.uid} </Text>
        
        <TouchableOpacity onPress={()=> {navigation.navigate('Tasks', {uid: route.params.uid})}}>
          <Text>Ir a Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> {navigation.navigate('Agregar Tarea', {uid: route.params.uid})}}>
          <Text>Ir a Crear tareas</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={irACrearSector}>
          <Text>Ir a Crear Sector</Text>
        </TouchableOpacity>

        <FlatList
        data={sectors}
        renderItem={({item}) => <View style={styles.container}><TouchableOpacity>
                                  <Text style={styles.item}>{item.key}</Text>
                                </TouchableOpacity>
                                </View>
                                }>

        </FlatList>
        
      </SafeAreaView>
    )
    }
  