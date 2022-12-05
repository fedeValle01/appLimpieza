import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, View, Image, TextInput, Alert, TouchableOpacity, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot, setDoc, doc, where } from 'firebase/firestore'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';
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
    const [taskAvaiable, setTaskAvaiable] = useState([]);


    const [data2, setdata2n] = useState([
      {key: 'aris'},
      {key: 'ardasdis'},
      {key: 'ff'},
      {key: 'aggris'},
    ]);

    const setearTask = () =>{
      setTask_name(data2);
    }

    const agregarAgaria = () =>{
      let obj = {};
      let aux = [];
      aux = data2;
      obj['key'] = 'floripondio';
                  aux.push(obj);
      console.log('aux'+ aux);
      setdata2n(aux);
    }
  const verTaskSelected = () =>{
    task_name.forEach(element => {
      console.log('taskName: '+element.key);
    });

    }


   const viewTaskAvaiable = () => {
      setTask_name(taskAvaiable);
   }
  const ejecuteQuery = (item) => {

      console.log('entro en ejecuteQuery');
      
      let collectionRef = collection(db, 'tasks');
      let unsuscribe;
      let TaskQuery = [];
      let Tasks = [];

      if (item){
      item.forEach(element => {
        let q = query(collectionRef, where("task_sector", "==", element))
        unsuscribe = onSnapshot(q, querySnapshot =>{

            TaskQuery = (
            querySnapshot.docs.map(doc =>({
              key: doc.data().task_name,
            }))
          )
          if (TaskQuery == ''){
            console.log('taskquery vacio');
          }else{
            console.log('taskQuery: '+TaskQuery);

            TaskQuery.forEach((task) => {
              let singleObj = {};
              singleObj['key'] = task.key;
              Tasks.push(singleObj);
        });
        Tasks.forEach(element => {
          console.log('TASK ASIGNADAS: '+element.key);
         });
              setTaskAvaiable(Tasks);
          }
           
         })
       });
       

      }else{
        console.log('se setea vacio');
        setTask_name([]);
        
      }

       return unsuscribe;
      
      
  }

  const renderItem = ({ item }) => {
    if (selected){
      console.log('selected: '+selected);

      console.log('item renderItem: '+item.title);
      return(
        <Item title={item.title} />
      );
    }else{
      setTask_name([]);
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
        
        console.log('entro assignTaskScreen');
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
        if (selected){

        }
        



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
                        }}
                        renderItem={item => _renderItem(item)}
                        
                    />
          <View style = {{width: 200, marginTop: 15}}>
            <Button               
              title="Ver tareas disponibles"
              color="#B0C4DE"
              onPress={viewTaskAvaiable}
            />
          </View>



      <FlatList
              data={task_name}
              renderItem={({item}) => (
                <View style = {styles.row}>
                  <Text style={styles.item}>{item.key}</Text>
                  <TouchableOpacity onPress={() =>{console.log('se toco: '+item.key); }}><Text style= {styles.item}>Toca aca</Text></TouchableOpacity>
                </View>
              ) }
            />
        
        <TouchableOpacity onPress={verTaskSelected}><Text>Ver taskSelected</Text></TouchableOpacity>
        <TouchableOpacity onPress={setearTask}><Text>setearTask</Text></TouchableOpacity>

        <TouchableOpacity onPress={agregarAgaria}><Text>agaria</Text></TouchableOpacity>
        
        
 
            
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