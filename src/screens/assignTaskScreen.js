import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, View, Image, TextInput, Alert, TouchableOpacity, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot, setDoc, doc, where } from 'firebase/firestore'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Notifications from 'expo-notifications';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

export default function AssignTaskScreen ({navigate, route}){

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const [value, setValue] = useState(null);
    const [sectors, setSectors] = useState([]);
    const [task_description, setTask_description] = useState(null);
    const [task_name, setTask_name] = useState([]);
    const [task_frec, setTask_frec] = useState(1);
    const [items, setItems] = useState([]);
    const [user, setUser ] = useState([]);
    const [dropdown, setDropdown] = useState(null);
    const [selected, setSelected] = useState([]);
    const [taskSelected, setTaskSelected ] = useState([]);
    const [bolean, setBolean] = useState(true);


    

  const verTaskSelected = () =>{
      console.log('taskSelected: '+task_name);
      console.log('sectorSelected: '+task_name);

    }
  const ejecuteQuery = ({item}) => {

      let collectionRef = collection(db, 'tasks');
      let q = query(collectionRef, where("task_sector", "==", "cocina"))
      task_name.forEach(element => {
        console.log('taskname: '+ element.title);
       });
      let unsuscribe = onSnapshot(q, querySnapshot =>{

        setTask_name(
          querySnapshot.docs.map(doc =>({
            title: doc.data().task_name,
          }))
        )
        
       })
       if (!item){
        console.log('No hay item');
        setTask_name();
       }
       
  }

  const renderItem = ({ item }) => {

      
          if (task_name){ 
            console.log('Que item hay aca'+item.title);
            console.log('Y en taskname?'+task_name.title);

          return (
    
            <Item title={item.title} />
            
          )
        }
}

  const Item = ({ title }) => (
    <View style={styles.itemFlatlist}>
      <Text style={styles.titleFlatlist}>{title}</Text>
    </View>
  );


  const addTaskSelected = (item) =>{

    let arregloTasks = [];
          if(item){
            item.forEach((sector) => {
                  let singleObj = {};
                  singleObj['title'] = sector;
                  singleObj['id'] = sector;
                  arregloTasks.push(singleObj);
            });
            setTaskSelected(arregloTasks);

  }
}

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
      }else{
        await setDoc(doc(db, 'tasks', task_name), {
        task_name: task_name,
        task_description: task_description,
        task_sector: value,
        task_frec: task_frec,
      }).then(Alert.alert('Tarea Creada'));
     }  
    }
  
    
    
    
  
    


    useEffect(() =>{
        

        //-----------Notifications------------------
        Notifications.scheduleNotificationAsync({
          content: {
            title: "TasksAdd!",
            body: 'Limpia gato!',
          },
          trigger: {
            seconds: 10,
          },
        });
        



        let collectionRef = collection(db, 'sectors');
        let q = query(collectionRef, orderBy('sector_name', 'desc'))
        
        let unsuscribe = onSnapshot(q, querySnapshot =>{
        let sectors = [];

        sectors = (
            querySnapshot.docs.map(doc =>({
              sector_name: doc.data().sector_name,
              sector_description: doc.data().sector_description,
            }))
          )

        let arregloSectores = [];
          if(sectors){
              sectors.forEach((sector) => {
                  let singleObj = {};
                  singleObj['label'] = sector.sector_name;
                  singleObj['value'] = sector.sector_name;
                  arregloSectores.push(singleObj);
            });
            setSectors(arregloSectores);
          }else console.log('No hay sectores');

         })




            collectionRef = collection(db, 'user');
            q = query(collectionRef, orderBy('username', 'asc'))
            
            
            unsuscribe = onSnapshot(q, querySnapshot =>{
                let users = [];
                users = (
                querySnapshot.docs.map(doc =>({
                  label: doc.data().username,
                  value: doc.data().username,
                }))
                )
                setUser(users)
        
         
    })
        return unsuscribe;
      }, [])

    return (
        <SafeAreaView style = {styles.container}>

                    <Dropdown
                        style={styles.dropdown}
                        containerStyle={styles.shadow}
                        data={user}
                        search
                        searchPlaceholder="Buscar usuario"
                        labelField="label"
                        valueField="value"
                        label="Dropdown"
                        placeholder="Al usuario"
                        value={dropdown}
                        onChange={item => {
                        setDropdown(item.value);
                            console.log('selected', item);
                        }}
                        renderLeftIcon={() => (
                            <Image style={styles.icon}  />
                        )}
                        renderItem={item => _renderItem(item)}
                        textError="Error"
                    />
              
            <MultiSelect

                        renderLeftIcon={() => (
                          <Image style={styles.icon}  />
                        )}
                        containerStyle={styles.shadow}
                        style={styles.dropdown}
                        data={sectors}
                        labelField="label"
                        valueField="value"
                        label="Multi Select"
                        placeholder="En el sector"
                        search
                        searchPlaceholder="Buscar sector"
                        value={selected}
                        onChange={item => {
                        addTaskSelected(item);
                        setSelected(item);
                        ejecuteQuery(item);

                            console.log('item: ', item);
                        }}
                        renderItem={item => _renderItem(item)}
                        
                    />
                    

                    <FlatList
        data={task_name}
        renderItem={renderItem}
        keyExtractor={task_name => task_name.title}
      />

        <TouchableOpacity onPress={verTaskSelected}><Text>Ver taskSelected</Text></TouchableOpacity>
                    


            
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