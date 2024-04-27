import React, { memo, useEffect, useState } from "react";
import { Text, SafeAreaView, TouchableOpacity, Alert, View, ScrollView, Image} from "react-native";
import { doc, setDoc, getFirestore, collection, onSnapshot, query, where, serverTimestamp, updateDoc, getDoc, getDocs} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Checkbox } from "react-native-paper";
import LoadingGif from '../components/Loading'
import Separator from '../components/Separator'
import styles from "./stylesScreens";
import { app, auth, db } from '../helpers/getFirebase'

export default function AutoAssignTaskScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true)
  const [usersInHome, setUsersInHome] = useState([]);
  const [assigned_tasks, setAssignedTasks] = useState([]);
  const [active_tasks, setActiveTasks] = useState([]);
  const [userList, setUserList] = useState([]);
  const [nextUserList, setNextUserList] = useState([]);
  const [usersOutHome, setUsersOutHome] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [checkNotifyAllUsers, setCheckNotifyAllUsers] = useState('checked');




  const AreYouSurePass = () => {
    return Alert.alert("Asignar tareas a los usuarios en casa reasignando los sectores segun su historial. Se le asignara a cada usuario el sector le toco menos veces en promedio", "Esta seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: nextWeekByHistory },
    ]);
  }
  
  const AreYouSureAssign = () => {
    return Alert.alert("Asignar tareas a todos los usuarios en casa rotando los sectores", "Esta seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: nextWeek },
    ]);
  }

  const AreYouSureSaveOrder = () => {
    return Alert.alert("Guardar orden de rotación", "Esta seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: saveUserOrder },
    ]);
  }

const deepCopy = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    // If the object is a primitive or null, return it as is
    return obj;
  }

  if (Array.isArray(obj)) {
    // If the object is an array, create a new array and copy each element
    const newArray = [];
    for (let i = 0; i < obj.length; i++) {
      newArray[i] = deepCopy(obj[i]);
    }
    return newArray;
  }
  // If the object is a non-array object, create a new object and copy each property
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepCopy(obj[key]);
    }
  }

  return newObj;
  }


  const getListSectors = (nUsers) => { //PRIORIDAD DE LOS SECTORES
    let ListSectors = []
    switch (nUsers) {
      case 11:
      ListSectors = ['Cocina', 'Baño 1', 'Baño 2', ['Baño 3', 'Duchas fondo'], 'Patio interno', 'Cocina', 'Patio externo', ['Lavadero 1', 'Lavadero 2'], 'Sala de estudio', 'Vereda', 'Otro'];
      break;
      case 10:
      ListSectors = ['Cocina', 'Baño 1', 'Baño 2', ['Baño 3', 'Duchas fondo'], 'Patio interno', 'Cocina', 'Patio externo', ['Lavadero 1', 'Lavadero 2'], 'Sala de estudio', 'Otro'];
      break;
      case 9:
      ListSectors = ['Cocina', 'Baño 1', 'Baño 2', ['Baño 3', 'Duchas fondo'], 'Patio interno', 'Cocina', 'Patio externo', ['Lavadero 1', 'Lavadero 2'], 'Sala de estudio'];
      break;
      case 8:
      ListSectors = ['Cocina', 'Baño 1', 'Baño 2', ['Baño 3', 'Duchas fondo'], 'Patio interno', 'Cocina', 'Patio externo', ['Lavadero 1', 'Lavadero 2']];
      break;
      case 7:
      ListSectors = ['Cocina', 'Baño 1', 'Baño 2', ['Baño 3', 'Duchas fondo'], 'Patio interno', 'Cocina', 'Patio externo'];
      break;
      case 6:
      ListSectors = ['Cocina', 'Baño 1', 'Baño 2', ['Baño 3', 'Duchas fondo'], 'Patio interno', 'Cocina'];
      break;
      case 5: 
      ListSectors = ['Cocina', 'Baño 1', 'Baño 2', ['Baño 3', 'Duchas fondo'], 'Patio interno']
      break;
      case 4:
      ListSectors = ['Cocina', 'Baño 1', 'Baño 2', 'Patio Interno']
      break;
      default:
      console.log('Número no válido');
      break;
      }
    return ListSectors
  }

  const reAsignUserList = (copyUserList) => {
    console.log('reAsignUserList');
    const nUser = copyUserList.length
    let priorityListSectors = getListSectors(nUser)
    let usersToReasign = {}

    for (let i = 0; i < nUser; i++) { // iterate usersList
      let user = copyUserList[i]
      let sectorUser = user.sectors
      let cantSectors = sectorUser.length
      let reasign = true

      for (let j = 0; j < cantSectors; j++) { //iterate userSectors
        let indexPriority = 0
        let findSector = false
        while (indexPriority < priorityListSectors.length) { //iterate priorityListSectors
          let sector = priorityListSectors[indexPriority]
          if (areSameSectors(sector, sectorUser)){
            priorityListSectors.splice(indexPriority, 1)
            findSector = true
            reasign = false
            indexPriority = indexPriority+9999
            break
          }
          indexPriority++
        }
        if (!findSector){
          console.log('NO ENCONTRO');
          break
        }
      }

      if (reasign){ //the user dont have a assigned sector or have one or more sectors out of priorityList
        usersToReasign[i] = user //is a dictionary
      }

    }

    for (const i in usersToReasign) { // reasign the sectors in userList

      let user = usersToReasign[i];
      let username = user.username
      console.log('diccionario nombre usuario: '+username);
      let auxSectors = priorityListSectors.pop()
      let sectors = []
      console.log(' ');
      console.log('auxSectors: ',auxSectors+' tipo del sector: '+typeof auxSectors+ ' length: '+ auxSectors.length);
      if (typeof auxSectors === 'string'){
        sectors.push(auxSectors)
      }else{
        for (let k = 0; k < auxSectors.length; k++) {
          let sector = auxSectors[k];
          sectors.push(sector)
        }
      }
      user.sectors = sectors
      copyUserList[i] = user
    }

  }

  const areSameSectors = (sectorsa, sectorsb) => { //compare 2 sectors and return true or false
    
    let sameSectors = true;
    let sectors1 = []
    if (typeof sectorsa === 'string'){
      sectors1.push(sectorsa)
    }else{
      sectors1 = sectorsa;
    }
    sectors1.sort()
    sectorsb.sort()
      if (sectors1.length !== sectorsb.length) {

        sameSectors = false;
      }else{
        let find = false
        for (let i = 0; i < sectors1.length; i++) {
          find = false
          if (sectors1[i] == sectorsb[i]) {
            find = true
          }

        }
        if (!find){
          sameSectors = false
        }
    }
    return(sameSectors)
  }

  

  const sortUsers = (userList, userOrder) => {
    // Crear un objeto que mapee los objetos en userOrder por su uid
    const userOrderMap = {};
    userOrder.forEach((user, index) => {
      userOrderMap[user.uid] = { index, username: user.username };
    });
  
    // Ordenar userList en función del orden de userOrder
    userList.sort((a, b) => {
      const userA = userOrderMap[a.uid];
      const userB = userOrderMap[b.uid];
  
      // Si no se encuentra un usuario en userOrder, mantén su posición original
      if (!userA && !userB) return 0;
      if (!userA) return 1;
      if (!userB) return -1;
  
      // Compara los índices en userOrder para determinar el orden
      return userA.index - userB.index;
    });
  
    return userList;
  };


  const toNamesAndUid = (user) =>{
    let nameAndUid = {}
    nameAndUid.uid = user.uid
    nameAndUid.username = user.username
    return nameAndUid
  }

  async function handleUserOrder(){
    if (!userList){
      Alert.alert('No hay usuarios cargados')
      return
    }else{
      let namesAndUid = []
      userList.forEach(user => {
        let nameAndUid = {}
        nameAndUid.uid = user.uid
        nameAndUid.username = user.username
        namesAndUid.push(nameAndUid)
      });
      await setDoc(doc(db, "config", "user_order"), {
        user_order: namesAndUid
      });
    }
      
  }
  const saveUserOrder = () => {
    console.log('guardar orden de rotacion');
    handleUserOrder();
  }

  const updateUserList = (i) => {
    let nextUserListAux = userList.map(user => ({ ...user })); // copy the userList
    let newUserList = userList.map(user => ({ ...user })); // copy the userList
    let userClicked = newUserList[i]
    let userUpp = nextUserListAux[i-1]
    newUserList[i-1] = userClicked
    newUserList[i] = userUpp
    setUserList(newUserList)
  }

  const orderUp = (i) => {
    if (i==0) return
    updateUserList(i)
    
    
    let rotUserListAux = deepCopy(nextUserList)
    let rotUserList = deepCopy(nextUserList)
    let rotUserClicked = rotUserListAux[i]
    
    let userUp = rotUserListAux[i-1]
    let userUpUp = rotUserListAux[i-2]
    rotUserList[i-1] = rotUserClicked
    rotUserList[i] = userUp
    if (i == 1){
      console.log('i=1');
      let firtUser = rotUserList[0]
      let secondUser = rotUserList[i]
      let thridUser = rotUserList[i+1]
      let lastUser = rotUserList[rotUserList.length-1]
      let firstSector = deepCopy(firtUser.sectors)
      let secondSector = deepCopy(secondUser.sectors)
      let thridSector = deepCopy(thridUser.sectors)
      let lastSector = deepCopy(lastUser.sectors)

      console.log(thridUser.sectors);
      console.log(thridUser.username);

      firtUser.sectors = lastSector
      secondUser.sectors = firstSector
      lastUser.sectors = secondSector

      setNextUserList(rotUserList)
    }else{//rotation in the midle
      
      let userUUP = rotUserList[i-2]
      let actualUser = rotUserListAux[i]
      let actualSector = deepCopy(actualUser.sectors)
      let downSector = deepCopy(userUp.sectors)
      let upUpSector = deepCopy(userUpUp.sectors)
      actualUser.sectors = upUpSector
      userUp.sectors = actualSector
      userUpUp.sectors = downSector
      rotUserClicked.sector = upUpSector
      userUp.sector = actualSector
      userUUP.sectors = downSector
      setNextUserList(rotUserList)
    }
        
  }

  const hasSaveHistory = () => { //check if the last history is saved
      //foreach assigned_tasks
      let cont = 0;
      let setHistory = [];
      let objHistory = {};
      assigned_tasks.forEach(async (element) => {
        console.log("foreach vuelta: " + cont);
        cont++;
  
        objHistory.timestamp = element.timestamp;
  
        let hasEven = false;
        if (element.history) {
          setHistory = element.history;
          hasEven = setHistory.some(
            (h) => String(h.timestamp) == String(objHistory.timestamp)
          );
        }
        //If the current assigned task has the same timestamp as one from the history, go to nextWeek.
        if (hasEven) {
          console.log('el historial esta guardado');
          //go nextWeek
        }else{

          const saveHistory = async (history, uid) => {
            await updateDoc(doc(db, "assigned_tasks", uid), {
              history,
            }).catch((error) => {
              alert(error);
            });
          }

          objHistory.data = element.active_tasks;
          objHistory.control_marked_tasks = element.control_marked_tasks;
          objHistory.marked_tasks = element.marked_tasks;
  
          //just push actual assigned task and his data in history
          setHistory.push(objHistory);
          let history = setHistory;
          let uid = element.uid
          Alert.alert("El historial no esta guardado", "Quiere guardarlo?", [
            {
              text: "Cancelar",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: saveHistory(history, uid) }, //TESTEAR ESTO
          ])


          
          

      }
      });
  }
  
  const getHistoryOfAllUsers = async () => {

    let q = query(collection(db, "assigned_tasks"));
    const querySnapshot = await getDocs(q);
    let records = {}

    querySnapshot.forEach((doc) => {
      let id = doc.id
      records[id] = doc.data().history
    })
    console.log(querySnapshot.size);
    console.log(records.size);

    return records
  }
  
  const createHistoryStat = async () => {
    let historyOfAllUsers = await getHistoryOfAllUsers()
    if (!historyOfAllUsers){
      Alert.alert('No hay historial guardado de ningun usuario')
      return
    }

    let totalNumberSectorsAssigned = 0
    let totalCountSectorsAssigned = {} //ej {cocina: 7, baño 1: 5 }
    let countTotalWeeks = 0
      for (id in historyOfAllUsers) {
        let history = historyOfAllUsers[id]
        let countUserWeeks = 0
        history.forEach(week => {
          console.log(week);
        });
      }

  }

  const getHistoryStat = async () => {
    const docRef = doc(db, "stats", "history_length");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()
    }
  }
  const nextWeekByHistory = async ()  => {

    let HistoryStat = await getHistoryStat()
    if(!HistoryStat){
      createHistoryStat()
    }

  }

  const nextWeek = () => {

    nextUserList.forEach(async user => {
      let sectors = user.sectors
      let uidUser = user.uid
      let username = user.username
      let expoPushToken = user.expoPushToken
      let active_tasks = []

      sectors.forEach((sector, i) => {
        console.log("vuelta "+i+" bucle sector");
        console.log(" ");

          let getTasks = [];
          let tasks = [];
          let collectionRef = collection(db, "tasks");
          let q = query (collectionRef, where("task_sector", "==", sector), where("default_assigned", "==", true));

          let unsuscribe = onSnapshot(q, async (querySnapshot) => {
            getTasks = querySnapshot.docs.map((doc) => ({
              task_name: doc.data().task_name,
            }));
            
            getTasks.forEach((task, i) => {
              tasks[i] = task.task_name;
            });
            
            let objTask = {};
            
            objTask.data = tasks;
            objTask.sector = sector;
            active_tasks.push(objTask);

          });//end unsuscribe


      });//end foreach sectors
      
               const docRef = doc(db, "assigned_tasks", uidUser);
               const docSnap = await getDoc(docRef);
               if (docSnap.exists()) {
                 console.log('doc exist, asignar tareas de '+ uidUser);
                  let markedd = [];
                  let checkIndex = 0;
                  
                  active_tasks.forEach((s) => {
                    
                    s.data.forEach((task) => {
                      markedd[checkIndex] = "unchecked";
                      checkIndex++;
                    });
                  });
                 await updateDoc(doc(db, "assigned_tasks", uidUser), {
                   active_tasks: active_tasks,
                   marked_tasks: markedd,
                   control_marked_tasks: markedd,
                   timestamp: serverTimestamp(),
                   uid: uidUser,
                   // time_limit: date,
                 })
               } else {
                let markedd = [];
                let checkIndex = 0;
                
                active_tasks.forEach((s) => {
                  
                  s.data.forEach((task) => {
                    markedd[checkIndex] = "unchecked";
                    checkIndex++;
                  });
                });
                 console.log('doc no existe, asignar tareas de '+ uidUser);
                 await setDoc(doc(db, "assigned_tasks", uidUser), {
                   active_tasks: active_tasks,
                   marked_tasks: markedd,
                   control_marked_tasks: markedd,
                   timestamp: serverTimestamp(),
                   uid: uidUser,
                 })
               }
               if (expoPushToken && (checkNotifyAllUsers == 'checked')) notifyUser(expoPushToken, username)
               
   

    });//end foreach nextUserList

  } //end nextWeek

  async function notifyUser(expoPushToken, username) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Hola '+username+'!',
      body:  'Tenes nuevas tareas asignadas 🧹',
      data: { someData: 'goes here' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

 
  useEffect(() => {
    console.log('entra useffect');
    

    // -------- table config --------
    // the sectors assigned to users will rotate in a specific order
    async function handleUserOrder(){









      //set users from params
    let colAssignedTasks = route.params.colAssignedTasks
    let usersInHome = route.params.usersInHome
    let usersOutHome = route.params.usersOutHome
    setAssignedTasks(colAssignedTasks)
    setUsersInHome(usersInHome)
    setUsersOutHome(usersOutHome)
    let reAsignedUserList = false
    let userListOriginal = []
    let active_tasks = []
    colAssignedTasks.forEach(assigned_task => {
      if (assigned_task.active_tasks){
        active_tasks = assigned_task.active_tasks
        let objUser = {}
        let findUser = false
        usersInHome.forEach(user => {
          if (assigned_task.uid == user.uid){
            findUser = true
            objUser.uid = user.uid
            objUser.username = user.username
            objUser.expoPushToken = user.expoPushToken
            let sectors = []
            active_tasks.forEach(s => {
              sectors.push(s.sector)
            });
            if(sectors){
              objUser.sectors = sectors
            }else{
              objUser.sectors = ['No tiene sectores asignados']
            }
          }
        });
        if (findUser){
          userListOriginal.push(objUser) //userList have all users in home with active tasks,
          //is a collection of objets, objUser have strings username, uid and array sectors
        }
      }
    });

    //console.log('n usu: '+users.length+' n: ususInHome: '+usersInHome.length+ ' nUserList: '+userList.length);

    if (usersInHome.length > userListOriginal.length){
      for (let i = 0; i < usersInHome.length; i++) { // find user in home withing tasks assigned
        const userA = usersInHome[i];
        const uidA = userA.uid;
        let findUser = false
        for (let j = 0; j < userListOriginal.length; j++) {
          const userB = userListOriginal[j];
          const uidB = userB.uid
          if (uidA == uidB){
            findUser = true
            break
          }
        }
        if (!findUser){
          let objUser = {}
          objUser.uid = userA.uid
          objUser.username = userA.username
          objUser.expoPushToken = userA.expoPushToken
          objUser.sectors = ['No tiene sectores asignados']
          userListOriginal.push(objUser)
        }
      }
     
    }
    let userList = userListOriginal.map(user => ({ ...user })); // copy the userList










      const usersOrder = doc(db, "config", "user_order");
      const docSnap = await getDoc(usersOrder);
      if (docSnap.exists()) {
        let userOrder = docSnap.data()
        userOrder = userOrder.user_order


        // if userOrder have the sames user than userList will show in that order
        if ( userOrder.length == userList.length ){
          console.log('misma cant us');
          let sameList = false
          for (let indexUserOrder = 0; indexUserOrder < userOrder.length; indexUserOrder++) {
            const user = userOrder[indexUserOrder];
            let uid = user.uid

            let i=0
            let buscaUid = true
            let encontroUid = false

            while (buscaUid) {
              let userUid = userList[i]
              if(userUid){
                userUid = userUid.uid
              }
              if(uid == userUid){
                buscaUid = false
                encontroUid = true
              }
              i++
              if (i > userList.length){
                buscaUid = false
              }
            }

            if (encontroUid == false){ //isn't the same userList
              console.log('listas con distintos usuarios');
              sameList = false
              break
            }else{
              sameList = true
            }
          }

          if(sameList){
            console.log('mismos usuarios');
            let sortedUserList = sortUsers(userList, userOrder);
            setUserList(sortedUserList)
            console.log('GUARDA ESTO Y NO LO TOCA: ', sortedUserList);
            userList = sortedUserList.map(user => ({ ...user })); // copy the userList
            
            reAsignUserList(userList) // reAsign by priorityListSectors

          }else{
            sortUsers(userList, userOrder)
            reAsignUserList(userList) // reAsign by priorityListSectors
          }
          setUserOrder(userOrder)
        }else{
          console.log('orderUser.lenght != userList.lenght');
          let sortedUsers = sortUsers(userList, userOrder)
          setUserList(sortedUsers)

          let copyUserList = userList.map(user => ({ ...user })); // copy the userList
          reAsignUserList(copyUserList) // reAsign by priorityListSectors
          reAsignedUserList = copyUserList
        }

      } else {
        console.log("No encontro orden de los usuarios");
        let namesAndUid = [] //only names and uid
        userList.forEach(user => {
          let objuser = {}
          objuser.username = user.username
          objuser.uid = user.uid
          namesAndUid.push(objuser)
        });
        await setDoc(doc(db, "config", "user_order"), {
          user_order: namesAndUid
        });
      }
      
      let nextUserList = []




      if(reAsignedUserList){
        nextUserList = reAsignedUserList.map(user => ({ ...user })); // copy the userList
        let firtUser = reAsignedUserList[0]
        for (let i = nextUserList.length-2; i >= 0 ; i--) { //sector rotation
          let currentUser = nextUserList[i]
          let user = reAsignedUserList[i+1]
          currentUser.sectors = user.sectors
        }
        let lastUser = nextUserList[nextUserList.length-1]
        lastUser.sectors = firtUser.sectors
        setNextUserList(nextUserList)
      }else{
        nextUserList = userList.map(user => ({ ...user })); // copy the userList
        let firtUser = userList[0]

        for (let i = nextUserList.length-2; i >= 0 ; i--) { //sector rotation
          let currentUser = nextUserList[i]
          let user = userList[i+1]
          currentUser.sectors = user.sectors
        }
        let lastUser = nextUserList[nextUserList.length-1]
        lastUser.sectors = firtUser.sectors
        setNextUserList(nextUserList)
      }
      setLoading(false)
    }
    
    handleUserOrder();

  }, []);


  const UsersOutHomeComp = () =>{
    let formattedUsers = usersOutHome.map((user, i) => user.username)
    formattedUsers = formattedUsers.join(", ");
    let msj = "";
    if(usersOutHome.length == 0){
      msj = "No hay usuarios fuera de casa"
    }
    return (
            <View>
              <Text style={{ fontSize: 17 }}> Usuarios fuera de casa: {formattedUsers} {msj} </Text> 
            </View>
            )
  }

  const ArrowUpImg = memo(() => (
    <Image
          style={{ width: 25, height: 25 }}
          source={require("../assets/arrowUp.png")}
    />
)
);
  // Return AutoAssignTaskScreen
  return (
    <SafeAreaView style={[styles.container, {backgroundColor:"#fff"}]}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ScrollView>
          <View style={{marginTop: 15}}/>

          <Text style={styles.titleRotation}>Sectores asignados actualmente</Text>
              {loading && (
                <View style={styles.center}>
                  <LoadingGif />
                </View>
              )}
              {
                userList.map(user => {
                  let username = user.username
                  let sectors = user.sectors
                  if (sectors){
                    let formattedSectors = sectors.join(", ");
                    return (
                      <>
                        <View style={styles.viewRotation}>
                          <Text key={user.uid} style={{ fontSize: 16, marginLeft: 10 }}>
                            {username}   -   {formattedSectors} 
                          </Text>
                        </View>
                      </>
                      );
                  }
        
                })
              }
            <View style={{marginTop: 10}}>
              
                {usersOutHome && <UsersOutHomeComp />}
            </View>

            <View style={{marginTop: 40}}>

              <Text style={styles.titleRotation}>Los sectores rotaran a</Text>

              {
                  nextUserList.map((user, i) => {
                    let username = user.username
                    let sectors = user.sectors
                    if (sectors){
                      let formattedSectors = sectors.join(", ");
                      //.join(", ");
                      console.log(formattedSectors);
                      return (
                        <>
                          <View style={styles.viewRotation}>
                            <View >
                              <Text key={user.uid} style={{ fontSize: 16, marginLeft: 10 }}>
                                {username}  -   {formattedSectors} 
                              </Text>
                            </View>
                            
                            <View style={{ alignSelf: "flex-end", marginRight: 15}}>
                              <TouchableOpacity onPress={() => {orderUp(i)}}>
                                <ArrowUpImg />
                              </TouchableOpacity>
                            </View>
                            
                          </View>
                        </>
                        );
                    }
                  })
                }
            </View>
          <View style={{marginTop: 15}}/>
          <View>
            <View style={styles.center}>
              <TouchableOpacity onPress={AreYouSureAssign} style={styles.btnUsuario}>
                <Text style={styles.txtUser}>Pasar de semana</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {(checkNotifyAllUsers=='checked') ? setCheckNotifyAllUsers('unchecked') : setCheckNotifyAllUsers('checked')}} style={styles.center}>
                <Text style={{marginLeft:10}}>Notificar a usuarios</Text>
                <Checkbox status={checkNotifyAllUsers}/>
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 15}}/>
            <TouchableOpacity onPress={AreYouSureSaveOrder}>
              <View style={{ alignItems: 'center', backgroundColor: '#DDDDDD', padding: 18 }}>
                <Text style={{fontSize: 15}}>Guardar orden de rotación</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={AreYouSurePass} style={styles.btnUsuario}>
                <Text style={styles.txtUser}>Pasar de semana por estadística</Text>
              </TouchableOpacity>
          </View>

          <View style={{marginTop: 40}}/>
        </ScrollView>
        
      </View>
    </SafeAreaView>
  );
}