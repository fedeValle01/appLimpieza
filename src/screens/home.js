import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, TextInput, TouchableOpacity, Alert, View, ScrollView, SectionList } from 'react-native';
import { doc, setDoc, getFirestore, collection, orderBy, onSnapshot, query, where, serverTimestamp, updateDoc } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, getIdToken, signOut} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';
import { Checkbox, Colors } from 'react-native-paper';

  
 
export default function HomeScreen({navigation, route}) {

    const auth = getAuth(app);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [sectors, setSectors ] = useState([]);
    const [user, setUser ] = useState([]);
    const [activeTasks, setActiveTasks ] = useState([]);
    const [checkList, setCheckList] = useState([]);
    const [checked, setChecked] = useState([]);


    let contador = -1;
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

  const irACrearSector = () =>{
    if (route.params.uid == 'UDUaYCyuVJYCTP7Y21DJ7ylD8aO2'){
      console.log('Estamos ante el creador');
      navigation.navigate('AddSector', {uid: route.params.uid});
    }
    else alert('solo admin');
  }

const logActiveTasks = () => {
  activeTasks.forEach(element => {
    let active_tasks = element.active_tasks;
    active_tasks.forEach(task => {
      console.log('sector: '+task.sector);
      task.data.forEach(task => {
      console.log('tarea: '+task);
      });
    });
  });
}
const handleCheck = async (i) => {

  let check = checkList;
  if (check.length>0){
    if (check[i]=='unchecked'){
      check[i] = 'checked';
    }else{
      check[i] = 'unchecked';
    }
  }
  setCheckList(check);

          //Add markedTask
          await updateDoc(doc(db, 'assigned_tasks', route.params.uid), {
            markedTask: check,
            timeStampMarkedTask: serverTimestamp(),
          });
  
}
const renderAssignedTasks = ({ item }) =>{
  
  
  contador++;
  if (contador>=checkList.length){
    contador = 0;
  }
  let checkIndex = 0;

  //  si no hay checklist, la setea unchecked
  if (checkList.length == 0){
    console.log('check vacio, set unchecked');
    activeTasks.forEach(s => {
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
    const logOut = () =>{
      const auth = getAuth();
      signOut(auth).then(() => {
        alert('Session cerrada');
        navigation.navigate('Login');
      }).catch((error) => {
        alert(error);
      });
    }
    
    const Item = ({ title }) => (
      <View style={styles.itemFlatlist}>
        <Text style={styles.titleFlatlist}>{title}</Text>
      </View>
    );

    const renderSectionList = (item) =>{
      return (
        <Item title={item} />
      )
    }

    useEffect(() => {

      let q;
      let unsuscribe;
      let collectionRef = collection(db, 'sectors');
      q = query(collectionRef, orderBy('sector_name', 'asc'))

      unsuscribe = onSnapshot(q, querySnapshot =>{
        setSectors(
          querySnapshot.docs.map(doc =>({
            key: doc.data().sector_name,
            sector_description: doc.data().sector_description,
          }))
        )
      })


      let u;
      collectionRef = collection(db, 'user');
      q = query(collectionRef, where("uid", "==", route.params.uid))
      unsuscribe = onSnapshot(q, querySnapshot =>{
      u = (
        querySnapshot.docs.map(doc =>({
          name: doc.data().username,
        }))
      )

      u.forEach(element => {
        console.log('u: '+element.name);
        setUser(element.name)
      });
      
    })


    collectionRef = collection(db, 'assigned_tasks');
  
    q = query(collectionRef, where("uid", "==", route.params.uid))

    unsuscribe = onSnapshot(q, querySnapshot =>{
      let qAssigned_tasks = (
        querySnapshot.docs.map(doc =>({
          timestamp: doc.data().timestamp,
          uid: doc.data().uid,
          active_tasks: doc.data().active_tasks,
        }))
      )

      let activeTasks = [];
      qAssigned_tasks.forEach(element => {
        activeTasks = element.active_tasks;
      });
      setActiveTasks(activeTasks);

    })
  

      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("ya tienes sesión iniciada con:"+route.params.uid); 
      }
      return unsuscribe;
      });
    }, []);
  


    // Return HomeScreen
    return (
      <SafeAreaView style = {styles.container}>
        <View style = {styles.container}>
          
              <View style = {{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
              <Text style = {styles.titleHeader}>Hola {user} !</Text>
              
            </View>

            
          <TouchableOpacity onPress={()=> {navigation.navigate('Tasks', {uid: route.params.uid})}}>
            <Text>Ir a Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> {navigation.navigate('Agregar Tarea', {uid: route.params.uid})}}>
            <Text>Ir a Crear tareas</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={irACrearSector}>
            <Text>Ir a Crear Sector</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={logActiveTasks}>
            <Text>Ver tareas activas</Text>
          </TouchableOpacity>

          <TouchableOpacity style = {{width: 200, height: 40, marginTop: 50}} onPress={()=> {navigation.navigate('Asignar Tarea', {uid: route.params.uid})}}>
            <Text>Ir a Asignar Tareas</Text>
          </TouchableOpacity>

          <View style = {{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
              <Text style = {styles.subtitleSection}>Tareas asignadas de esta semana:</Text>
            </View>
      <View style = {{height: "50%"}}>

          <SectionList
          sections={activeTasks}
          renderItem={renderAssignedTasks}
          renderSectionHeader={({ section: { sector } }) => (
            <Text style={styles.SectionHeader}>{sector}</Text>
          )}
        />
          
      </View>

      </View>

      </SafeAreaView>
    )
    }