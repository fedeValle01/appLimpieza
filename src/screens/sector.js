import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot } from 'firebase/firestore'
import firebaseConfig from '../firebase-config' 
import styles from '../screens/stylesScreens'
import { app, auth, db } from '../helpers/getFirebase'

export default function Sector({navigation, route})  {
    const numbers = [1, 2, 3, 4, 5];
    const [sectors, setSectors ] = useState([]);
    

const irACrearSector = () =>{
  if (route.params.uid == 'UDUaYCyuVJYCTP7Y21DJ7ylD8aO2'){
    // console.log('Estamos ante el creador');
    navigation.navigate('AddSector', {uid: route.params.uid});
  }
  else alert('solo admin');
}



function ListItem(props) {
    return(
      <SafeAreaView>
      <Text>{props.value}</Text>
      </SafeAreaView>
    );
  } 
  
  function NumberList(props) {
    const numbers = props.numbers;
    return (
      <Text>
        {numbers.map((number) =>
          <ListItem key={number.toString()}
                    value={number} />
        )}
      </Text>
    );
  }
  
 
  
  const SectorList = (props) => {
    const sectors = props.sectors;
    let arregloNombres = [];
    if(sectors!=""){
      sectors.forEach((sector, i) => {
        arregloNombres[i] = sector.sector_name;
        console.log('arregloNombres['+i+'] : ',arregloNombres[i] );
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
      console.log('no hay sectores');
    }
    
  }
  
  //-------SCREEN SECTORS-----------
  
    useEffect(() =>{
      const collectionRef = collection(db, 'sectors');
      const q = query(collectionRef, orderBy('sector_name', 'asc'))
  
      const unsuscribe = onSnapshot(q, querySnapshot =>{
        setSectors(
          querySnapshot.docs.map(doc =>({
            sector_name: doc.data().sector_name,
            sector_description: doc.data().sector_description,
          }))
        )
      })
      return unsuscribe;
    }, [])
    return (
        
      <SafeAreaView style = {styles.container}>
        
        <Text>Sectores screen</Text>
        <NumberList numbers = {numbers}/>

        
          {/* <Text>uid {route.params.uid} </Text> */}
        
        <TouchableOpacity onPress={()=> {navigation.navigate('Tasks', {uid: route.params.uid})}}>
          <Text>Ir a Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> {navigation.navigate('Agregar Tarea', {uid: route.params.uid})}}>
          <Text>Ir a Crear tareas</Text>
        </TouchableOpacity>

        <SectorList sectors = {sectors}/>

        <TouchableOpacity onPress={irACrearSector}>
          <Text>Ir a Crear Sector</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
    
  }