import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, View, TextInput, Alert, Image, TouchableOpacity, Button } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot, setDoc, doc } from 'firebase/firestore'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Notifications from 'expo-notifications';
import { Dropdown } from 'react-native-element-dropdown';


export default function AddTasks ({navigate, route}){

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const [task_description, setTask_description] = useState(null);
    const [task_name, setTask_name] = useState(null);
    const [task_frec, setTask_frec] = useState(1);
    const [dropdown, setDropdown] = useState(null);
    const [sectorSelected, setSectorSelected] = useState(null);

    

      //Add element to objet
    

      const _renderItem = item => {
        return (
        <View style={styles.item}>
            <Text style={styles.textItem}>{item.label}</Text>
            <Image style={styles.icon}  />
        </View>
        );
    }

    const handleCreateTask = async () => {
      if (!task_name){
        Alert.alert('Falta nombre de la tarea');
      }if (!sectorSelected){
        Alert.alert('Falta seleccionar sector');
      }
      else{
        await setDoc(doc(db, 'tasks', task_name), {
        task_name: task_name,
        task_description: task_description,
        task_sector: sectorSelected,
        task_frec: task_frec,
      }).then(Alert.alert('Tarea Creada'));
     }  
    }
  
    
    
    
    
  
    


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
          let sectors = [];

          sectors = (
            querySnapshot.docs.map(doc =>({
              sector_name: doc.data().sector_name,
              sector_description: doc.data().sector_description,
            }))
          )

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
          })
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
            />
            <Dropdown
                        style={styles.dropdown}
                        containerStyle={styles.shadow}
                        data={items}
                        search
                        searchPlaceholder="Buscar sector"
                        labelField="label"
                        valueField="value"
                        label="Dropdown"
                        placeholder="Sector"
                        value = {value}
                        onChange = {item => {                                                                                                                                                                                                                                                                         setDropdown(item.value);
                            console.log('selected', item.value);
                            setSectorSelected(item.value)
                        }}
                        renderLeftIcon={() => (
                            <Image style={styles.icon}  />
                        )}
                        renderItem={item => _renderItem(item)}
                        textError="Error"
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