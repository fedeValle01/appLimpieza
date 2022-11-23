import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot } from 'firebase/firestore'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';
import DropDownPicker from 'react-native-dropdown-picker';

export default function AddTasks ({navigate, route}){

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [sectors, setSectors ] = useState([]);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);

    function ListItem(props) {
        return(
          <SafeAreaView>
          <Text>{props.value}</Text>
          </SafeAreaView>
        );
      } 
      


      //Add element to objet
    const getSector = (sectors) =>{
        let arregloNombres = [];
        if(sectors){
            sectors.forEach((sector) => {
                let singleObj = {};
                singleObj['label'] = sector.sector_name;
                singleObj['value'] = sector.sector_name;
                arregloNombres.push(singleObj);
          });
          setItems(arregloNombres);
        }else console.log('No hay sectores');
    }

      const SectorList = (props) => {
        const objSectors = props.sectors;
        let arregloNombres = [];
        if(objSectors!=""){
            objSectors.forEach((sector, i) => {
            arregloNombres[i] = sector.sector_name;
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
        getSector(sectors);
        return unsuscribe;
      }, [])

    return (
        <SafeAreaView style = {styles.container}>
            <Text onPress={() =>{console.log('getSector: ', getSector(sectors))}}>Screen Add Task</Text>
            <SectorList sectors = {sectors}/>
            <TouchableOpacity onPress={() =>{console.log('Sectors: '+ sectors)}}>
                <Text>Ver sectors</Text>
            </TouchableOpacity>
            <DropDownPicker containerStyle ={{width: '35%'}}
                placeholder='Sectores'
                placeholderStyle={{
                    textAlign: 'center'
                  }}
                max={20}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={getSector}
                />
        </SafeAreaView>
    )
}