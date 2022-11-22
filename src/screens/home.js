import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { doc, setDoc, getFirestore } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, getIdToken} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
 
export default function HomeScreen({navigation, route}) {

    const [sector, setSector] = useState('');
    const [description, setDescription] = useState('');
  
    const handleCreateSector = async () => {
      console.log('Sector: '+ sector);
      console.log('Sector description : '+ description);
  
      // Add a new document in collection "sectors"
      // Get a list of sectors from your database
      await setDoc(doc(db, 'sectors', sector), {
        sector_name: sector,
        sector_description: description
      });
    } 
    
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken().then(function(idToken) {  // <------ Check this line          
          // console.log(idToken); 
          console.log("ya tienes sesión iniciada con:"+route.params.uid);
          });
      }
         
  
          
      });
    }, []);
  
    return (
      <SafeAreaView style = {styles.container}>
        <Text>Nombre sector</Text>
        <TextInput placeholder='Nombre sector' onChangeText={(text) => setSector(text)}></TextInput>
        <Text>Descripcion sector</Text>
        <TextInput placeholder='Descripcion' onChangeText={(text) => setDescription(text)}></TextInput>
  
        <TouchableOpacity onPress={handleCreateSector}>
          <Text>Crear sector</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate('Sectors', {uid: route.params.uid})}}>
          <Text>Ver sectores</Text>
        </TouchableOpacity>
        <Text>Ver {route.params.uid} </Text>

        
      </SafeAreaView>
    )
  }