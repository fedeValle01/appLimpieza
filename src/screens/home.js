import React, { memo, useCallback, useEffect, useState } from "react";
import LoadingGif from '../components/Loading'
import { Text, SafeAreaView, RefreshControl, TouchableOpacity, Alert, View, SectionList, Image, Button, ScrollView } from "react-native";
import {doc,getFirestore,collection,onSnapshot,query,where,serverTimestamp,updateDoc , deleteField, getDocs,} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import { Checkbox } from "react-native-paper";
import { Tooltip } from '@rneui/themed';
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const ControlledTooltip = (props) => {
  const [open, setOpen] = React.useState(false);
  return (
        <Tooltip
          visible={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          {...props}
        />
  );
}

const auth = getAuth(app);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const HomeScreen = ({ navigation, route }) => {
  console.log('HomeSceeen');
    const [chargedOrderedTasks, setChargedOrderedTasks] = useState(false);
    const [allDescTasks, setAllDescTasks] = useState([]);//contains all descriptions from tasks assigned
    const [orderedTasks, setOrderedTasks] = useState([]);//contains only tasks names of tasks assigned
    const [tasksInSectors, setTasksInSectors] = useState([]);//all tasks in assigned sector
    const [sectors, setSectors] = useState([]);
    const [user, setUser] = useState([]);
    const [taskUser, setTaskUser] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const [hasAssignedTasks, setHasAssignedTasks] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 1400);
    }, []);
    
    let contador = -1
    const [canControl, setCanControl] = useState(false);
    
    const [firsTask, setFirsTask] = useState('');
    const [activeTasks, setActiveTasks] = useState([]);
    const [nTasks, setNTasks] = useState(0);

    const [checkList, setCheckList] = useState([]);
    const [controlCheckList, setControlCheckList] = useState([]);
    const [canCheckTask, setCanCheckTask] = useState(false);

    const [checked, setChecked] = useState([]);
    const [markAll, setMarkAll] = useState(false);
    const [checkControlAll, setCheckControlAll] = useState(false);


    const getToken = async () => {
      const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

      if (status !== "granted"){
        return
      }
      const token = await Notifications.getExpoPushTokenAsync();
    }

    
    const irACrearSector = () => {
      if (canControl) {
        navigation.navigate("AddSector", { uid: route.params.uid });
      } else  Alert.alert("Solo admin puede crear sector");
    
    };
    

    const logActiveTasks = () => {
      activeTasks.forEach((element) => {
        let active_tasks = element.active_tasks;
        active_tasks.forEach((task) => {
          console.log("sector: " + task.sector);
          task.data.forEach((task) => {
            console.log("tarea: " + task);
          });
        });
      });
    };
    
    const logCheckList = () => {
      checkList.forEach((element, i) => {
        console.log('checkList['+i+']: '+element);
      });
    };


    const handleControlCheck = async (i) => {
      let check = controlCheckList;
      if (check.length > 0) {
        if (check[i] == "unchecked") {
          check[i] = "checked";
        } else {
          check[i] = "unchecked";
        }
      }

      //Add markedTask
      await updateDoc(doc(db, "assigned_tasks", route.params.uidTask), {
        control_marked_tasks: check,
        timestamp_control_marked_tasks: serverTimestamp(),
      });
    }

    const handleCheck = async (i) => {
      
      let check = [...checkList];
      if (check.length > 0) {
        if (check[i] == "unchecked") {
          check[i] = "checked";
        } else {
          check[i] = "unchecked";
        }
      }

      setCheckList(check);
      //Add markedTask
      await updateDoc(doc(db, "assigned_tasks", route.params.uidTask), {
        marked_tasks: check,
        timestamp_marked_tasks: serverTimestamp(),
      });

    }

    const setAllMarked = async () => {
      let checks = checkList;
      if (!markAll){
        checks.forEach((task, i) => {
          checks[i] = 'checked';
        });
        setMarkAll(true)
      }else{
        checks.forEach((task, i) => {
          checks[i] = 'unchecked';
        });
        setMarkAll(false)
      }
      await updateDoc(doc(db, "assigned_tasks", route.params.uidTask), {
        marked_tasks: checks,
        timestamp_control_marked_tasks: serverTimestamp(),
      });
      
    }

    const setAllChecked = async () => {
      let checkList = controlCheckList;
      if (!checkControlAll){
        checkList.forEach((task, i) => {
          checkList[i] = 'checked';
        });
        setCheckControlAll(true)
      }else{
        checkList.forEach((task, i) => {
          checkList[i] = 'unchecked';
        });
        setCheckControlAll(false)
      }
      await updateDoc(doc(db, "assigned_tasks", route.params.uidTask), {
        control_marked_tasks: checkList,
        timestamp_control_marked_tasks: serverTimestamp(),
      });
      
    }

  
    const renderAssignedTasks = ({ item, index }, checkList, controlCheckList) => {

      contador++;
      if (firsTask==item){
        contador = 0
        console.log('i = 0');
        }
      if (contador == nTasks){
        contador = 0
        console.log('i = 0');
      }
      let i = contador;
      nTasks

      // console.log('render item: '+item+'con index: '+i);
      
        return (
          <TouchableOpacity style={styles.viewSeccion} disabled={!canControl} onLongPress={() => AreYouSureDeleteTask(item)}>
              <Item title={item} i = {i}/>
    
    
              <View style={{ flexDirection: "row", alignItems: "center", position: "absolute", right: 0 }}>
                <View>
                  {/* user checkbox */}
                  <Checkbox
                    disabled={!canCheckTask}
                    status={checkList[i]}
                    onPress={() => {
                      handleCheck(i);
                      if (checked == "unchecked") {
                        setChecked("checked");
                      } else {
                        setChecked("unchecked");
                      }
                    }}
                  />
                </View>
                <View>
                  {/* control checkbox */}
                  <Checkbox
                    color="#39ff14"
                    status={controlCheckList[i]}
                    disabled={!canControl}
                    onPress={() => {
                      handleControlCheck(i);
                      if (checked == "unchecked") {
                        setChecked("checked");
                      } else {
                        setChecked("unchecked");
                      }
                    }}
                  />
                </View>
            </View>
          </TouchableOpacity>
        );
  }

    const AreYouSureLogOut = () => {
      return Alert.alert("Vas a cerrar sesion", "Esta seguro?", [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: logOut },
      ]);
    }

    const logOut = () => {
      signOut(auth)
        .then(() => {
          navigation.navigate("Iniciar Sesion");
        })
        .catch((error) => {
          alert(error);
        });
    };

    const HouseImg = memo(() => (
      <Image
        style={{ width: 170, height: 170 }}
        source={require("../assets/casaLaCosta.png")}
      />
    ));

    const ConfigImg = memo(() => (
      <Image
        style={{ width: 25, height: 25 }}
        source={require("../assets/config.png")}
      />
    )); 

    const HistorialImg = memo(() => (
      <Image
        style={{ width: 30, height: 30 }}
        source={require("../assets/historial.png")}
      />
    ));

    const LogOutImg = memo(() =>(
        <Image
          style={{ width: 27, height: 27 }}
          source={require("../assets/cerrar-sesion.png")}
        />
    ))


  const SectionComponent =  () => {


    return(
  <View style={{ height: "55%"}}>

  <SectionList
    sections={activeTasks}
    renderItem={(props) =>
      renderAssignedTasks(props, checkList, controlCheckList)
    }
    renderSectionHeader={({ section: { sector } }) => (
      <Text style={styles.SectionHeader}>{sector}</Text>
    )}
  />

  <View style={{ flexDirection: "row-reverse", marginTop:20, marginBottom: 10 }}>
    <BtnControlAll/>
      <View style = {{marginLeft: 5}} />
    <BtnSelectAll/>
  </View>


  {/* <TouchableOpacity onPress={() => {
        navigation.navigate("TestScreen", {
          uid: route.params.uid,
          uidTask: route.params.uidTask,
          taskUser: taskUser,
        });
      }}>
    <Text>TestScreen</Text>
  </TouchableOpacity> */}

  </View>

  )
};

    function LogoTitle() {
      return (
        <Image
          style={{ width: 50, height: 50 }}
          source={require("../assets/logo.png")}
        />
      );
    }

    const HomeImg = memo(() => (
      
        <Image
          style={{ width: 45, height: 45 }}
          source={require("../assets/home.png")}
        />
      
      )
    );
    const EditImg = memo(() => (
        <Image
              style={{ width: 23, height: 23 }}
              source={require("../assets/edit.png")}
        />
    )
  );
    const AsigImg = React.memo(() => (
      <Image
        style={{ width: 30, height: 30 }}
        source={require("../assets/asig.png")}
      />
    ));

    const UsersImg = memo(() => (
        <Image
          style={{ width: 33, height: 33 }}
          source={require("../assets/usuarios.png")}
        />
      )
    );
    const IconInfo = memo(() => (
        <Image
          style={{ width: 17, height: 17 }}
          source={require("../assets/info-circle.png")}
        />
      )
    );
    

    // memo optimiza carga de imagenes
    const AgregarTareaImg = memo(() => (
      <Image
        style={{ width: 25, height: 25 }}
        source={require("../assets/c.png")}
      />
    ));


    const calculeHeight = (desc) => {
      let h = 100;
      let haveDesc = false;
      if(desc!=null){
        haveDesc = true;
        let descLength = desc.length;
        if(descLength<=28){ // one line
          h = 40
        }else if(descLength>28 &&descLength<45){// two lines
          h = 60
        }else if(descLength>=45 && descLength<65){// three lines
          h = 80
        }else if(descLength>=65 && descLength<100){ //four lines
          h = 100
        }else if(descLength>=100 && descLength<120){ //five lines
          h = 130;
        }else{
          h = 180;
        }
      }
      return(h)
    }
    
    const Item = ({ title, i }) => { // RENDER ITEM TASK
    let haveDesc = false;
    let h = 0
    let desc = allDescTasks[i]
    if(desc!=null){
      haveDesc = true;
      h = calculeHeight(desc)
    }

    title = title.trim()
    
      return(
        <View style={[styles.itemSectionlist, {maxWidth: '60%'}] }>
          {haveDesc &&

            <ControlledTooltip
                  popover={<Text>{desc}</Text>}
                  containerStyle={{ width: 200, height: h }}
                  backgroundColor={"#f6cb8e"}
                >

                  <View style={{flexDirection: "row", alignItems: "center", justifyContent: 'space-between'}}>
                    <View>
                      <Text numberOfLines={2} style={[styles.titleSectionlist ]}>{title}</Text>
                    </View>
                    <View style={{marginLeft: 10}}>
                      <IconInfo/>
                    </View>
                  </View>
                  
            </ControlledTooltip>

          }
          {!haveDesc &&
                  <View style={{flexDirection: "row", alignItems: "center", justifyContent: 'space-between'}}>
                    <Text numberOfLines={2} style={[styles.titleSectionlist]}>{title}</Text>
                  </View>
          }
        </View>
      );
    }





    // -------------------------------UseEffect------------------------------------
    useEffect(() => {
      console.log('-----------');
      console.log('Entra useEfect');
      console.log('-----------');

      let cControl = false;
      setNTasks(0);
      if (route.params.loading) {
        console.log('tiene parametro loading');
        setLoading(true)
      }else{
        console.log('NO tiene parametro loading');
        setLoading(false)
      }

      if (route.params.fromUserScreen) {
        setHasAssignedTasks(undefined)
        setActiveTasks([]);
        setFirsTask('')
      }
      if (route.params.uid == route.params.uidTask) {
        //The user viewing their own tasks
        setCanCheckTask(true);
      } else {
        setCanCheckTask(false);
      }
      contador = -1
      let taskUser
      let q;
      let unsuscribe;
      setAllDescTasks([]);
      let u;
      let canControl2 = false;
      let collectionRef = collection(db, "user");
      q = query(collectionRef, where("uid", "==", route.params.uid));
      unsuscribe = onSnapshot(q, (querySnapshot) => {
        u = querySnapshot.docs.map((doc) => ({
          name: doc.data().username,
          canControl: doc.data().can_control,
        }));

        u.forEach((element) => {
          console.log("u: " + element.name); //username active session
          setUser(element.name);
          setCanControl(element.canControl);
          canControl2 = element.canControl
          cControl = element.canControl
          console.log('control: ', element.canControl);
        });
      });

      collectionRef = collection(db, "user");
      q = query(collectionRef, where("uid", "==", route.params.uidTask));
      unsuscribe = onSnapshot(q, (querySnapshot) => {
        u = querySnapshot.docs.map((doc) => ({
          name: doc.data().username,
        }));

        u.forEach((element) => {
          taskUser = element.name
          console.log("u: " + taskUser); //username that will show his tasks
          setTaskUser(taskUser);
        });
      });

     
      let tasks = []
      let sectorTasks = []
      let qAssigned_tasks = []
      
      const getAsign = async () =>{
        let q = query(collection(db, "assigned_tasks"), where("uid", "==", route.params.uidTask));
        const querySnapshot = await getDocs(q);
        qAssigned_tasks = querySnapshot.docs.map((doc) => ({
          timestamp: doc.data().timestamp,
          uid: doc.data().uid,
          active_tasks: doc.data().active_tasks,
          markedTasks: doc.data().marked_tasks,
          controlMarkedTasks: doc.data().control_marked_tasks,
        }));
        console.log('termina qasig');

        let controlMarkedTasks = [];
        let activeTasks = [];
        let markedTasks = [];
        

        qAssigned_tasks.forEach((element) => {
          activeTasks = element.active_tasks;
          markedTasks = element.markedTasks;
          controlMarkedTasks = element.controlMarkedTasks;
          if (markedTasks) {
            // console.log("se encontraron tareas marcadas");
            setCheckList(markedTasks);
          }
          if (controlMarkedTasks) {
            // console.log("se encontraron tareas de control marcadas");
            setControlCheckList(controlMarkedTasks);
          }
        });
        if (activeTasks.length > 0) {
          setHasAssignedTasks(true)
          setActiveTasks(activeTasks);
          

          //set nTasks
          let nTasks = 0
          let firsTask = 0
          let indexT = 0
          let nTasksInSectors = []
          activeTasks.forEach((element, i) => { //nTasksInSectors
            let d = element.data;
            nTasks = nTasks + d.length;
            sectorTasks[i] = element.sector;
            nTasksInSectors[i] = d.length
            d.forEach(task => {
              tasks[indexT] = task;
              indexT++;
            });
            setOrderedTasks(tasks);
          });

          firsTask = activeTasks[0]
          if(firsTask){
            firsTask = firsTask.data[0]
            setFirsTask(firsTask)
            // console.log('nTasks: '+ nTasks);
            setNTasks(nTasks);
          }else{
            setNTasks(0);
          }
          
          collectionRef = collection(db, "tasks");
      let tasksInSectors = []
      let taskInSector = []
      //get tasks of the assigned sectors
        
      sectorTasks.forEach((sector, i) => {
        q = query(collectionRef, where("task_sector", "==", sector));
        
        unsuscribe = onSnapshot(q, (querySnapshot) => {
          taskInSector = querySnapshot.docs.map((doc) => ({
            task_name: doc.data().task_name,
            task_description: doc.data().task_description,
            task_sector: doc.data().task_sector,
          }));
          
          tasksInSectors.push(taskInSector);
          if (i == sectorTasks.length-1){
            setTasksInSectors(tasksInSectors)
            setChargedOrderedTasks(false);
          }
        });

      
      });
      
        }else{
          setHasAssignedTasks(false)
        }


      }
      getAsign()

    
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("ya tienes sesión iniciada con:" + route.params.uid);
        }
        return unsuscribe;
      });

      //-----------NAVBAR------------------
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Usuarios", { uid: route.params.uid, canControl: (canControl || canControl2) })
              }
            >
              <View style={{ alignContent: "center" }}>
                <UsersImg />
              </View>
            </TouchableOpacity>

              <TouchableOpacity
              onPress={() => {
                navigation.navigate("HistorialScreen", {
                  uid: route.params.uid,
                  uidTask: route.params.uidTask,
                  taskUser: taskUser,
                });
              }}
            >
              <View style={{ marginLeft: 5}}>
                <HistorialImg />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>{
                if (canControl || cControl) {
                  navigation.navigate("Agregar Tarea", { uid: route.params.uid })
              }else{
                Alert.alert('Lo siento', 'Solo admin puede crear tareas',  [ {text: 'ok 😭'} ]);
              }
              }
            }
            >
              <View style={{ alignContent: "center", marginLeft:5 }}>
                <AgregarTareaImg />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>{
                if (canControl || cControl) {
                  navigation.navigate("Asignar Tareas", { uid: route.params.uid });
                }else{
                  Alert.alert('Lo siento', 'Solo admin puede asignar tareas',  [ {text: 'ok 😭'} ]);
                }
              }
              }
            >
              <View style={{ marginLeft: 5 }}>
                <AsigImg />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (canControl || cControl) {
                  navigation.navigate("Admin", {
                    uid: route.params.uid,
                    uidTask: route.params.uidTask,
                    canControl: canControl
                  });
                }else{
                  Alert.alert('Lo siento', 'No tienes permiso para administrar app',  [ {text: 'ok 😢'} ]);
                }
                
              }}
            >
              <View style={{ marginLeft: 7}}>
                <ConfigImg />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={AreYouSureLogOut}>
              <View style={{ marginLeft: 7 }}>
                <LogOutImg />
              </View>
            </TouchableOpacity>
          </View>
        ),
        headerLeft: () => <View></View>,
      });
      //-----------NAVBAR------------------

    },
    [refresh, route.params.uidTask],
  );


    

    const BtnSelectAll = () => {
      if (firsTask && canCheckTask){
        return(
          <View>
              <View style={{flex: 1}}>
                <Button onPress={setAllMarked}
                  title='Marcar Hechas'
                  color='#746ab0'
                  >
                </Button>
              </View>
          </View>
        )
      }
    }
  const BtnControlAll = () => {
    if (firsTask && canControl){
      return(
            <View style={{flex: 1}}>
              <Button onPress={setAllChecked}
                title='Marcar control'
                color='#E3682C'
                >
              </Button>
            </View>
      )
    }
  }

  const AreYouSureDeleteAllAssignedTasks = () => {
    if(!hasAssignedTasks){
      return(Alert.alert("No hay tareas asignadas"))
    }else{
      return Alert.alert("Vas a eliminar las tareas asignadas de "+taskUser, "Estas seguro?", [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },    
        { text: "OK", onPress: deleteAllAssignedTasks },
      ]);
    }
  }


  const deleteAllAssignedTasks = async () => {
      let ref = doc(db, "assigned_tasks", route.params.uidTask);
      await updateDoc(ref, {
        active_tasks: deleteField(),
      });
      setActiveTasks([])
  }

    
  const AreYouSureDeleteTask = (item) => {
    return Alert.alert("Vas a eliminar la tarea: "+item, "Estas seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },    
      { text: "OK", onPress: () => {deleteTask(item)} },
    ]);
  }

    const deleteTask = async (item) => {

      let updateActiveTasks = activeTasks
      let findTask = false
      let i = 0
      let indexToDelete = 0
      while (!findTask) {
        let activeTask = updateActiveTasks[i]
        let sector = activeTask.data
        for (let j = 0; j < sector.length; j++) {
          let task = sector[j];
          if (task == item){
            console.log('lo encontro');
            findTask = true
            sector.splice(j, 1)
            break
          }
          indexToDelete++
        }
        i++
        if (i > sector.length){
          findTask = true
        }
      }

      let ref = doc(db, "assigned_tasks", route.params.uidTask);

      let updateCheckList = checkList
      let updateControlCheckList = controlCheckList
      updateCheckList.splice(indexToDelete, 1)
      updateControlCheckList.splice(indexToDelete, 1)
      
      await updateDoc(ref, {
        active_tasks: updateActiveTasks,
        marked_tasks: updateCheckList,
        control_marked_tasks: updateControlCheckList,
      });
      setRefresh(refresh ? false : true);
      
    }

  const loadAllOrderedTasks = () => {
    if(!chargedOrderedTasks){
      if(tasksInSectors.length!=0){
        setChargedOrderedTasks(true);
        //filter allTasks
        orderedTasks.forEach(taskName => {
          for (let i = 0; i < tasksInSectors.length; i++) {
            const tasks = tasksInSectors[i];
              for (let j = 0; j < tasks.length; j++) {
                const task = tasks[j].task_name;
                if (task==taskName){
                  allDescTasks.push(tasks[j].task_description)
                  j = tasks.length;
                  i = tasksInSectors.length
                }
              }
          }
      });
      setAllDescTasks(allDescTasks)

      }
      
    }
  }

  if (!chargedOrderedTasks) {
    loadAllOrderedTasks();
  }



    // -------------------- Return HomeScreen ------------------------------
  

    console.log('-----------');
    console.log('return homescreeen');
    console.log('-----------');

    
    return (
      <SafeAreaView style={styles.container}>
        
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollViewHome}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { onRefresh(); setRefresh(refresh ? false : true);}} />
            }>
          <View
            style={{
              marginTop: 30,
              marginBottom: 30,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
              <HouseImg/>
          </View>

          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate("Tasks", { uid: route.params.uid });
            }}
          >
            <Text>Ir a Tasks</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={irACrearSector}>
            <Text>Ir a Crear Sector</Text>
          </TouchableOpacity>
           */}
          
          <View
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5 }}
          >
            <Text style={styles.subtitleSection}>
              Tareas de {taskUser} asignadas esta semana: {nTasks}{" "} 
              
              {canControl && 
                <Menu>
                  <MenuTrigger>
                    <View style={{marginLeft:10, alignSelf: "center"}}>
                      <EditImg />
                    </View>
                    
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption onSelect={() => AreYouSureDeleteAllAssignedTasks()} >
                      <View style={{alignSelf: "center"}}>
                        <Text style={{color: 'red'}}>Eliminar tareas asignadas</Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              }
              
            </Text>
            
            {/* <TouchableOpacity onPress={logCheckList}>
              <Text>logCheckList</Text>
            </TouchableOpacity> */}
            
          </View>
          </ScrollView>
            {hasAssignedTasks === false && <View style={{ position: "absolute", bottom: 230 }}><Text>No tiene tareas asignadas</Text></View>}
            {hasAssignedTasks === true || hasAssignedTasks === undefined || loading ? (
              <>
                {!firsTask ? (
                    <View style={{ position: "absolute", bottom: 150 }}><LoadingGif /></View>
                ) : (
                    <SectionComponent/>
                )}
              </>
            ) : null}
        </View>
        <View style={{marginTop: 15}}/>
      
      </SafeAreaView>
    );
  }
;
  export default memo(HomeScreen);