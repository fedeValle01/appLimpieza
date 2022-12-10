import React, {useEffect, useRef, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, View, Image, TextInput, Alert, TouchableOpacity, Button, FlatList, ScrollView, SectionList } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot, setDoc, doc, where, serverTimestamp } from 'firebase/firestore'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';
import * as Notifications from 'expo-notifications';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Checkbox } from 'react-native-paper';

export default function AssignTaskScreen ({navigate, route}){

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const [vuelta, setVuelta] = useState(1);

    const [value, setValue] = useState(null);
    const [sectors, setSectors] = useState([]);
    const [task_description, setTask_description] = useState(null);
    const [task_name, setTask_name] = useState([]);
    const [task_frec, setTask_frec] = useState(1);
    const [items, setItems] = useState([]);
    const [user, setUser ] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selected, setSelected] = useState([]);
    const [taskSelected, setTaskSelected ] = useState([]);
    const [taskAvaiable, setTaskAvaiable] = useState([]);
    const [prevIndex, setPrevIndex] = useState(0);

    //efect on update checklist
    const onUpdateCheck = useRef(true);

    const [checkList, setCheckList] = useState([]);

    


    
    const [checked, setChecked] = useState('unchecked');


    const DATA = [
      {
        title: "Main dishes",
        data: ["Pizza", "Burger", "Risotto"]
      },
      {
        title: "Sides",
        data: ["French Fries", "Onion Rings", "Fried Shrimps"]
      },
      {
        title: "Drinks",
        data: ["Water", "Coke", "Beer"]
      },
      {
        title: "Desserts",
        data: ["Cheese Cake", "Ice Cream"]
      }
    ];

    const [data2, setdata2n] = useState([
      {key: '1'},
      {key: '2'},
      {key: '3'},
      {key: '4'},
    ]);

    let contador = -1;

    const verChecklist = () =>{
      
      checkList.forEach((element, i) => {
        console.log('tarea: '+i+': '+element);
      });
    }
  const verTaskSelected = () =>{
    let id = [];
    console.log('paso n veces');
    task_name.forEach(element => {
    console.log('paso b veces');

      id = element.id;
      id.forEach(d => {
        console.log('id: '+d);
      });
    });

    }

  const ejecuteQuery = (item) => {
      let collectionRef = collection(db, 'tasks');
      let unsuscribe;
      let TaskQuery = [];
      let tasksAndSector = [];
      let nid = 0;

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

            let Tasks = [];
            let id = [];
            
            TaskQuery.forEach((task) => {
              let a;
              a = task.key;
              id.push(nid)
              Tasks.push(a);
              nid++;
              console.log('id each: '+nid);
        });

        

            let singleObj = {};
            singleObj['title'] = element;
            singleObj['data'] = Tasks;
            singleObj['id'] = id;


            tasksAndSector.push(singleObj);
        
              setTaskAvaiable(tasksAndSector);

              console.log('paso una vez por aca');
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
        Alert.alert('No hay tareas en ese sector');
      }else if(selectedUser == null){
        Alert.alert('No hay usuario seleccionado');
      }else {
        let cantChecks = 0;
        checkList.forEach(element => {
          if (element=='unchecked'){
            cantChecks++;
          }
        });
        if (cantChecks == checkList.length){
          Alert.alert('Por lo menos hay que asignar 1 tarea');
        }else{
          

          //Add AssignTask
          let addData = [];
          let search = 0;

          task_name.forEach(s => {
            let data = s.data;
            data.forEach((task) => {
              if (checkList[search] == 'checked'){
                addData.push(task);
                console.log('search: '+search);
                console.log('task: '+task);
              }
              search++
            });
            
          });

          await setDoc(doc(db, 'assigned_tasks', selectedUser), {
            active_tasks: addData,
          }).then(Alert.alert('Tareas asignadas'));
     }  
    }
  }


  const renderSectionList = ({item}) =>{
    
    contador++;
    let checkIndex = 0;
    //  si no hay checklist, la setea unchecked
    if (checkList.length == 0){
      task_name.forEach(s => {
        s.data.forEach(task => {
        checkList[checkIndex]='unchecked';
        checkIndex++;
        });
      });
    }
    let i = contador
    console.log('se renderiza con item '+item+' index: '+i);

    return (
      <View style = {styles.row}>
      <View>
        <Item title={item} />
      </View>
      <View style={{ flex: 1 }} />
      <View style = {{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
      <Text>{i}</Text>

        <Checkbox
        status={checkList[i]}
        onPress={() =>{
          handleCheck(i);
          if (checked=='unchecked'){
            setChecked('checked');
          }else{
            setChecked('unchecked');
          }
        }}
        />
      </View>

    </View>
    )


  }
  const renderChecklist = ({item}) => {
                

    console.log('se renderiza con item: '+item.key);
    let task = item.key;
    
    let j = 0;
    //  si no hay checklist, la setea unchecked
    if (checkList.length == 0){
      for (j=0; j < task_name.length; j++) {
        console.log('i: '+i);
        checkList[j]='unchecked';
      }
    }



    console.log('tarea: '+task+' en la posicion: '+i);
   return (
    <View style = {styles.row}>
      <View>
        <Text style={styles.item}>{task}</Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style = {{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
        <Checkbox
        status={checkList[i]}
        onPress={() =>{
          handleCheck(i);
        }}
        />
      </View>

    </View>
  ) }

    const handleCheck = (i) => {

      if (checkList.length>0){
        if (checkList[i]=='unchecked'){
          checkList[i] = 'checked';
        }else{
          checkList[i] = 'unchecked';
        }
      }
        
    }
  
    const getI = (index) =>{

      let prevI = prevIndex;
    if (index==prevI){
      setPrevIndex(0);
      prevI = index;
    }else{
      prevI++;
      setPrevIndex(prevI);
    }
    let i = prevI;

      return i;
    }


    useEffect(() =>{

        
        console.log('entro assignTaskScreen');
        //-----------Notifications------------------
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Ultimo dia para limpiar!",
            body: 'Tenes tareas en: cocina, patio externo',
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
                  uid: doc.data().uid,
                }))
                )
                setUser(users);



                if (onUpdateCheck.current) {
                  onUpdateCheck.current = false;
               } else {
                   console.log('updateCheck');
               }
        
         
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
                        label="User"
                        placeholder="Al usuario"
                        value={selectedUser}
                        onChange={item => {
                        setSelectedUser(item.uid);
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
              onPress={()=> {setTask_name(taskAvaiable)}}
            />
          </View>


        <SectionList
          style = {{height: "40%"}}
          sections={task_name}
          renderItem={renderSectionList}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.SectionHeader}>{title}</Text>
          )}
        />

        

        <View style = {{flex:1,}}>

        

          
          
  
              
            <View style = {{width: 200, marginTop: 25}}>
              <Button               
                title="Asignar Tareas"
                color="#43c6ac"
                onPress={handleCreateTask}
              />
            </View>
        </View>

      </SafeAreaView>
    )
}