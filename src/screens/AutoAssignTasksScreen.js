import React, { memo, useEffect, useState } from "react";
import { Text, SafeAreaView, TouchableOpacity, Alert, View, ScrollView, Image} from "react-native";
import { doc, setDoc, getFirestore, collection, orderBy, onSnapshot, query, where, serverTimestamp, deleteField, updateDoc, addDoc, getDoc} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import Separator from '../components/Separator'
import firebaseConfig from "../firebase-config";
import styles from "./stylesScreens";

console.log("Refresh AutoAssignTaskScreen");

export default function AutoAssignTaskScreen({ navigation, route }) {
  const auth = getAuth(app);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [usersInHome, setUsersInHome] = useState([]);
  const [assigned_tasks, setAssignedTasks] = useState([]);
  const [active_tasks, setActiveTasks] = useState([]);
  const [userList, setUserList] = useState([]);
  const [nextUserList, setNextUserList] = useState([]);
  const [usersOutHome, setUsersOutHome] = useState([]);
  const [userOrder, setUserOrder] = useState([]);

  const AreYouSureAssign = () => {
    return Alert.alert("Asignar tareas a todos los usuarios en casa rotando los sectores", "Esta seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: hasSaveHistory },
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


  const getListSectors = (nUsers) =>{
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
        let userSector = sectorUser[j]
        let indexPriority = 0
        let findSector = false
        while (indexPriority < priorityListSectors.length) { //iterate priorityListSectors
          let sector = priorityListSectors[indexPriority]
          if(sector == userSector){
            priorityListSectors.splice(indexPriority, 1)
            findSector = true
            if (j == cantSectors-1){ // is the last sector for that user
              reasign = false
            }
            break
          }
          indexPriority++
        }
        if (!findSector){
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
  
  const logUserList = (userList) => {
    userList.forEach(user => {
      console.log('--------');
      console.log('usuario: '+user.username);
      console.log('tiene: '+user.sectors);
    });
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
      const namesAndUid = userList.map(toNamesAndUid)
      await setDoc(doc(db, "config", "user_order"), {
        user_order: namesAndUid
      });
    }
      
  }
  const saveUserOrder = () => {
    console.log('guardar orden de rotacion');
    handleUserOrder();
  }

  const orderUp = (i) => {
    if (i!=0){
      let nextUserListAux = userList.map(user => ({ ...user })); // copy the userList
      let newUserList = userList.map(user => ({ ...user })); // copy the userList

      let userClicked = newUserList[i]
      let userUp = nextUserListAux[i-1]
      newUserList[i-1] = userClicked
      newUserList[i] = userUp
      setUserList(newUserList)
      
      let nextUserList = newUserList.map(user => ({ ...user })); // copy the userList
      let firtUser = newUserList[0]

      for (let i = nextUserList.length-2; i >= 0 ; i--) { // sector rotation
        console.log('i: '+i);
        let currentUser = nextUserList[i]
        let user = newUserList[i+1]
        currentUser.sectors = user.sectors
      }
      let lastUser = nextUserList[nextUserList.length-1]
      lastUser.sectors = firtUser.sectors
      setNextUserList(nextUserList)


        
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
          let q = query (collectionRef, where("task_sector", "==", sector));

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
               if (expoPushToken) notifyUser(expoPushToken, username)
               
   

    });//end foreach nextUserList

  } //end nextWeek

  async function notifyUser(expoPushToken, username) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Nuevas tareas asignadas!',
      body: 'Hola! '+username+' te',
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
    //set users from params
    let colAssignedTasks = route.params.colAssignedTasks
    setAssignedTasks(colAssignedTasks)
    let reAsignedUserList = false
    let usersInHome = route.params.usersInHome
    let usersOutHome = route.params.usersOutHome
    let users = route.params.users
    setUsersInHome(usersInHome)
    setUsersOutHome(usersOutHome)
    let userList = []
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
            console.log('encontro a '+user.username);
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
          userList.push(objUser) //userList have all users in home with active tasks,
          //is a collection of objets, objUser have strings username, uid and array sectors
        }
        
      }
    });
    console.log('n usu: '+users.length+' n: ususInHome: '+usersInHome.length+ ' nUserList: '+userList.length);
    setActiveTasks(active_tasks)
    setUserList(userList)
    

    // -------- table config --------
    // the sectors assigned to users will rotate in a specific order
    async function handleUserOrder(){
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
              userUid = userUid.uid
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
            userList = sortedUserList
          }else{
            sortUsers(userList, userOrder)
            reAsignUserList(userList) // reAsign by priorityListSectors
          }
          setUserOrder(userOrder);
        }else{
          console.log('orderUser.lenght != userList.lenght');
          sortUsers(userList, userOrder)
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
        console.log('ESTO ES REASIGNUSER');
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
    }
    handleUserOrder();

  }, []);


  const UsersOutHomeComp = () =>{
    let formattedUsers = usersOutHome.map((user) => user.username)
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
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ScrollView>
          <View style={{marginTop: 15}}/>

          <Text style={{fontSize: 20}}>Actualmente</Text>

              {
                userList.map(user => {
                  let username = user.username
                  let sectors = user.sectors
                  if (sectors){
                    let formattedSectors = sectors.join(", ");
                    return (
                      <>
                        <View style={{ marginTop: 5, flexDirection: "row", justifyContent: "space-between" }}>
                          <Text key={user.uid} style={{ fontSize: 16 }}>
                            {username} tiene sectores en :  {formattedSectors} 
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

            <View style={{marginTop: 10}}>

              <Text style={{fontSize: 20}}>Los sectores rotaran a</Text>

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
                          <View style={{ marginTop: 5, flexDirection: "row", justifyContent: "space-between" }}>
                            <View>
                              <Text key={user.uid} style={{ fontSize: 16 }}>
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
            <TouchableOpacity onPress={AreYouSureAssign} style={styles.btnUsuario}>
              <Text style={styles.txtUser}>Pasar de semana</Text>
            </TouchableOpacity>

            <View style={{marginTop: 15}}/>
            <TouchableOpacity onPress={AreYouSureSaveOrder}>
              <View style={{ alignItems: 'center', backgroundColor: '#DDDDDD', padding: 18 }}>
                <Text style={{fontSize: 15}}>Guardar orden de rotación</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{marginTop: 40}}/>
        </ScrollView>
        
        
        
      </View>
    </SafeAreaView>
  );
}
