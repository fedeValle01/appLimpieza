import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot } from 'firebase/firestore'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';


export default function TaskScreen({navigation, route}) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [user, setUser ] = useState([]);

  function ListItem(props) {
    return(
      <SafeAreaView>
        <TouchableOpacity onPress = { () =>{navigation.navigate('Home', {value: props.value})}} >
        <Text>{props.value}</Text>
        </TouchableOpacity>
      
      </SafeAreaView>
    );
  } 
  
 

  const SectorList = (props) => {
    const users = props.users;
    let arregloNombres = [];
    if(users!=""){
      users.forEach((user, i) => {
        arregloNombres[i] = user.username;
        // console.log('arregloNombres['+i+'] : ',arregloNombres[i] );
      });
      
  
      return (
        <Text>
          {arregloNombres.map((nombre) =>
            <ListItem key={nombre.toString()}
                      value={nombre} />
          )}
        </Text>
      );
    }else{
      console.log('no hay usuarios');
    }
    
  }


  useEffect(() =>{
    const collectionRef = collection(db, 'user');
    const q = query(collectionRef, orderBy('username', 'asc'))

    const unsuscribe = onSnapshot(q, querySnapshot =>{
      setUser(
        querySnapshot.docs.map(doc =>({
          username: doc.data().username,
          
        }))
        
      )
    })
    
    return unsuscribe;
  }, [])


    return(
    <SafeAreaView style = {styles.container}>
      <Text>Tasks</Text>
      <Text>Usuarios</Text>
      <SectorList users = {user}/>
    </SafeAreaView>
    )
  }