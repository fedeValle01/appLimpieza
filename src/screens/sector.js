import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot } from 'firebase/firestore'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';

export default function Sector({navigation, route})  {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const numbers = [1, 2, 3, 4, 5];
    const [sectors, setSectors ] = useState([]);
    





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
  
  
  
  //----------consolelogsectors--------
  // getDocs(collection(db, "sectors")).then(docSnap => {
  //   docSnap.forEach((doc)=> {
  //     sectors.push({ ...doc.data(), id:doc.id })
      
  //   });
    
  //       const listSectors = sectors.map((sector,i) =>{
  //         console.log("Sector "+i+': ',sector.sector_name);
  //         console.log("listSectors: ",listSectors);
  //         console.log("sectors: ",sectors);
  //       }    
  // );
  
  // });
  
  
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

        <SectorList sectors = {sectors}/>
      </SafeAreaView>
    )
    
  }