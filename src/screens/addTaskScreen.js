import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, View, TextInput, Alert, TouchableOpacity, Button } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot, setDoc, doc } from 'firebase/firestore'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Notifications from 'expo-notifications';


export default function AddTasks ({navigate, route}){

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [sectors, setSectors ] = useState([]);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const [task_description, setTask_description] = useState(null);
    const [task_name, setTask_name] = useState(null);
    


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


    const handleCreateTask = async () => {
      
      await setDoc(doc(db, 'tasks', task_name), {
        task_name: task_name,
        task_description: task_description,
        task_sector: value
      }).then(Alert.alert('Tarea Creada'));
      
      // console.log('valorPressed:'+ value+ ' task_dsq: '+task_description +' task_name: '+task_name);
    } 
    
    
    const stylesButton = StyleSheet.create({
      
      title: {
        textAlign: 'center',
        marginVertical: 8,
      },
      fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    });
  
    


    useEffect(() =>{
        const collectionRef = collection(db, 'sectors');
        const q = query(collectionRef, orderBy('sector_name', 'desc'))
    

        Notifications.scheduleNotificationAsync({
          content: {
            title: "TasksAdd!",
            body: 'Limpia gato!',
          },
          trigger: {
            seconds: 10,
          },
        });
        
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
            <Text style = {{textAlign: 'center'}} >Nombre Tarea</Text>
              <TextInput
              style={txtInput.input}
              onChangeText={(text) => setTask_name(text)}
              placeholder="Nombre Tarea"
              value={task_name}
              focusable
            />
            
            <Text style = {{textAlign: 'center'}} >Descripción</Text>
            <TextInput
              onChangeText={(text) => setTask_description(text)}
                multiline
                numberOfLines={4}
                value = {task_description}
                placeholder={'Descripción'}
                style={txtInputMultiline.input} 
                editable
                maxLength={200}
              />
          


            <DropDownPicker containerStyle ={{width: 200}}
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
                onPress = {() =>{getSector(sectors)}}
                />
          <View style = {{width: 200, marginTop: 25}}>
            <Button 
              
              title="Agregar Tarea"
              color="#43c6ac"
              onPress={handleCreateTask}
            />
          </View>
        </SafeAreaView>
    )
}
const txtInput = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200
  },
});

const txtInputMultiline = StyleSheet.create({
    input: {
      height: 150,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: 200,
      alignContent: 'flex-start',
      textAlignVertical: 'top'
    },
  });