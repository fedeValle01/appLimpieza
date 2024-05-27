import React, { memo, useCallback, useEffect, useState } from "react";
import LoadingGif from '../components/Loading'
import { Text, SafeAreaView, RefreshControl, TouchableOpacity, Alert, View, SectionList, Image, Button, ScrollView, Modal, Pressable } from "react-native";
import {doc,getFirestore,collection,onSnapshot,query,where,serverTimestamp,updateDoc , deleteField, getDocs,} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import { Tooltip } from '@rneui/themed';
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { useForm, Controller } from 'react-hook-form';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { BlurView } from "expo-blur";
import styleModal from "./styleModal";
import stylesStock from "./stock/stylesStock";
import TextInput from "../components/TextInput";
import Task from './components/Task'
import FormComment from "../components/FormComment"



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
    const [modalLeaveComment, setModalLeaveComment] = useState(false);
    
    const [hasAssignedTasks, setHasAssignedTasks] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [refresh, setRefresh] = useState(false);


    const { control, handleSubmit, formState: { errors } } = useForm();
    const [submittedData, setSubmittedData] = useState(null);

    const onSubmit = (data) => {
      // Simulate form submission
      console.log('Submitted Data:', data);
      setSubmittedData(data);
    };

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
        console.log('firsTask==item i = 0');
        }
      if (contador == nTasks){
        contador = 0
        console.log('contador == nTasks i = 0');
      }
      let i = contador;

      let props = {
        uidTask: route.params.uidTask,
        item: item,
        allDescTasks: allDescTasks,
        i: i,
        canControl: canControl,
        canCheckTask: canCheckTask,
        checkList: checkList,
        controlCheckList: controlCheckList,
        activeTasks: activeTasks
      }
      
      return (<Task props={props}/>)

  }


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

  const BtnComponents =  () => (
    <View style={{  flexDirection: "row", flexWrap: "wrap", opacity: 0.8, alignItems: "center", justifyContent: "space-between", position: "absolute", bottom: 50, alignSelf: "center"}}>
      <BtnSelectAll/>
        <View style = {{marginRight: 5}} />
      <BtnControlAll/>
    </View>
  )

  

  const closeModal = () => {
    setModalLeaveComment(false)
  };

  const SectionLeaveComment =  () => {


    return(
      <BlurView tint="dark" intensity={80} style={[styleModal.centeredView, {marginTop: -50}]}>
        <View style={styleModal.modalView}>

        <View style={{marginTop: 20}}>
              <FormComment uid={route.params.uidTask} closeModal={closeModal}/>
        </View>
        </View>
      </BlurView>
    )
  }

  const SectionTasks =  () => {


    return(
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalLeaveComment}
          onRequestClose={() => {
            setModalLeaveComment(false)
          }}>
          <SectionLeaveComment />
        </Modal>
      <SectionList
        sections={activeTasks}
        renderItem={(props) =>
          renderAssignedTasks(props, checkList, controlCheckList)
        }
        renderSectionHeader={({ section: { sector } }) => (
          <Text style={styles.SectionHeader}>{sector}</Text>
        )}
      />
        {canControl &&(
          <Pressable
            style={[styleModal.button, styleModal.buttonOpen]}
            onPress={() => setModalLeaveComment(true)}>
            <Text style={styleModal.textStyle}>Dejar observación</Text>
          </Pressable>
        )}
          
          <BtnComponents />
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
    
    

    // memo optimiza carga de imagenes
    const AgregarTareaImg = memo(() => (
      <Image
        style={{ width: 25, height: 25 }}
        source={require("../assets/c.png")}
      />
    ));


    
    
    





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
          if (element.name == 'Fede V') setCanControl(true);
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
            task_id: doc.id,
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
                navigation.navigate("Usuarios", { uid: route.params.uid, canControl: (canControl || canControl2), groupCode: route.params.groupCode })
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
                  navigation.navigate("Agregar Tarea", { uid: route.params.uid, canControl: true })
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
                  navigation.navigate("Admin", {
                    uid: route.params.uid,
                    uidTask: route.params.uidTask,
                    canControl: canControl
                  });
                
                
              }}
            >
              <View style={{ marginLeft: 7}}>
                <ConfigImg />
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
                <Button onPress={setAllMarked}
                  title='Marcar Hechas'
                  color='#746ab0'
                  >
                </Button>
              </View>
        )
      }
    }
  const BtnControlAll = () => {
    if (firsTask && canControl){
      return(
            <View>
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

    const Tutorial = () => {
      return(
        <View>

        <Text>Primera vez</Text>

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
        </View>
      )
    }
    if (route.params.firstTime) return (
      <Tutorial />
    )
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
          

          {/*
          <TouchableOpacity onPress={irACrearSector}>
            <Text>Ir a Crear Sector</Text>
          </TouchableOpacity>
           */}
          
          <View
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center",  marginVertical: 12 }}
          >
            <Text style={styles.titleMain}>
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
                    <View style={{ height: "80%"}}>
                      <SectionTasks/>
                      
                    </View>
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