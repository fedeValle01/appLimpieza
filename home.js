import React, { memo, useEffect, useState } from "react";
import {Text,SafeAreaView,TextInput,TouchableOpacity,Alert,View,SectionList,Image,Dimensions } from "react-native";
import {doc,setDoc,getFirestore,collection,orderBy,onSnapshot,query,where,serverTimestamp,updateDoc, getDoc,} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import { Checkbox } from "react-native-paper";
import { Tooltip, lightColors } from '@rneui/themed';

const { height } = Dimensions.get('window');

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

export default function HomeScreen({ navigation, route }) {
  const auth = getAuth(app);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [chargedOrderedTasks, setChargedOrderedTasks] = useState(false);
  const [allOrderedTasks, setAllOrderedTasks] = useState([]);//contains all objets from tasks assigned
  const [allDescTasks, setAllDescTasks] = useState([]);//contains all descriptions from tasks assigned
  const [orderedTasks, setOrderedTasks] = useState([]);//contains only tasks names of tasks assigned
  const [tasksInSectors, setTasksInSectors] = useState([]);//all tasks in assigned sector
  const [sectors, setSectors] = useState([]);
  const [user, setUser] = useState([]);
  const [taskUser, setTaskUser] = useState([]);

  
  let contador = -1
  //can mark check controlCheckList
  const [canControl, setCanControl] = useState(false);
  
  const [firsTask, setFirsTask] = useState('');
  const [activeTasks, setActiveTasks] = useState([]);
  const [nTasks, setNTasks] = useState(0);

  const [checkList, setCheckList] = useState([]);
  const [controlCheckList, setControlCheckList] = useState([]);
  const [canCheckTask, setCanCheckTask] = useState(false);

  const [checked, setChecked] = useState([]);

  const DATA = [
    //data example sectionList
    {
      title: "Main dishes",
      data: ["Pizza", "Burger", "Risotto"],
    },
    {
      title: "Sides",
      data: ["French Fries", "Onion Rings", "Fried Shrimps"],
    },
    {
      title: "Drinks",
      data: ["Water", "Coke", "Beer"],
    },
    {
      title: "Desserts",
      data: ["Cheese Cake", "Ice Cream"],
    },
  ];

  const irACrearSector = () => {
    if (canControl) {
      navigation.navigate("AddSector", { uid: route.params.uid });
    } else alert("solo admin");
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

  const handleControlCheck = async (i) => {
    let check = controlCheckList;
    if (check.length > 0) {
      if (check[i] == "unchecked") {
        check[i] = "checked";
      } else {
        check[i] = "unchecked";
      }
    }
    setControlCheckList(check);

    //Add markedTask
    await updateDoc(doc(db, "assigned_tasks", route.params.uidTask), {
      control_marked_tasks: check,
      timestamp_control_marked_tasks: serverTimestamp(),
    });
  };

  const handleCheck = async (i) => {
    let check = checkList;
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
  };


  
  const renderAssignedTasks = ({ item, index }, checkList, controlCheckList) => {

      contador++;
    if (firsTask == item){
      contador = 0;
    }
    let i = contador; 
    return (
      <View style={styles.viewSeccion}>
        <View>
          <Item title={item} i = {i}/>
        </View>
        <View style={{ flex: 1 }} />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>{i+1}</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        </View>
      </View>
    );
    
    
  };

  const AreYouSureAlert = () => {
    return Alert.alert("Va a cerrar sesion", "Esta seguro?", [
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

  const CasaImg = memo(() => (
    <Image
      style={{ width: 200, height: 200 }}
      source={require("../assets/casaLaCosta.png")}
    />
  ));

  const MezclaImg = memo(() => (
    <Image
      style={{ width: 30, height: 30 }}
      source={require("../assets/mezcla.png")}
    />
  )); 

  const HistorialImg = memo(() => (
    <Image
      style={{ width: 45, height: 45 }}
      source={require("../assets/historial.png")}
    />
  ));

  const LogOutImg = memo(() =>(
      <Image
        style={{ width: 27, height: 27 }}
        source={require("../assets/cerrar-sesion.png")}
      />
  ))


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


  const Item = ({ title, i }) => {
  let haveDesc = false;
  let h = 100;
  let desc = allDescTasks[i]
    if(desc!=null){
      haveDesc = true;
      let descLength = desc.length;
      console.log('descLength: '+descLength);
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
    return(
      <View style={styles.itemSectionlist}>
        {haveDesc&&
          <ControlledTooltip
                popover={<Text>{desc}</Text>}
                containerStyle={{ width: 200, height: h }}
                backgroundColor={lightColors.primary}
              >
                <Text style={styles.titleSectionlist}>{title}</Text>

          </ControlledTooltip>
        }
        {!haveDesc&&
                <Text style={styles.titleSectionlist}>{title}</Text>
        }
      </View>
    );
  }

  useEffect(
    () => {
      

      if (route.params.uid == route.params.uidTask) {
        //Es el usuario viendo sus tareas
        setCanCheckTask(true);
      } else {
        setCanCheckTask(false);
      }
      contador = -1

      let q;
      let unsuscribe;
      let collectionRef = collection(db, "sectors");
      q = query(collectionRef, orderBy("sector_name", "asc"));

      console.log('entra useEfect');
      setAllDescTasks([]);
      unsuscribe = onSnapshot(q, (querySnapshot) => {
        setSectors(
          querySnapshot.docs.map((doc) => ({
            key: doc.data().sector_name,
            sector_description: doc.data().sector_description,
          }))
        );
      });

      let u;
      collectionRef = collection(db, "user");
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
        });
      });

      collectionRef = collection(db, "user");
      q = query(collectionRef, where("uid", "==", route.params.uidTask));
      unsuscribe = onSnapshot(q, (querySnapshot) => {
        u = querySnapshot.docs.map((doc) => ({
          name: doc.data().username,
        }));

        u.forEach((element) => {
          console.log("u: " + element.name); //username that will show his tasks
          setTaskUser(element.name);
        });
      });

      
      collectionRef = collection(db, "assigned_tasks");
      q = query(collectionRef, where("uid", "==", route.params.uidTask));

      let tasks = []
      let sectorTasks = []
      unsuscribe = onSnapshot(q, (querySnapshot) => {
        let qAssigned_tasks = querySnapshot.docs.map((doc) => ({
          timestamp: doc.data().timestamp,
          uid: doc.data().uid,
          active_tasks: doc.data().active_tasks,
          markedTasks: doc.data().marked_tasks,
          controlMarkedTasks: doc.data().control_marked_tasks,
        }));
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
        if (activeTasks) {
          setActiveTasks(activeTasks);
          

          //set nTasks
          let nTasks = 0
          let firsTask = 0
          let indexT = 0;
          activeTasks.forEach((element, i) => {
            let d = element.data;
            nTasks = nTasks + d.length;
            sectorTasks[i] = element.sector;
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
          }
          
          collectionRef = collection(db, "tasks");
      let tasksInSectors = []
      let taskInSector = []
      //get tasks of the assigned sectors
        
      sectorTasks.forEach((sector, i) => {
        console.log('sector: '+sector);
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
      
        }
      });
      
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
                navigation.navigate("Usuarios", { uid: route.params.uid, canControl: canControl })
              }
            >
              <View style={{ alignContent: "center" }}>
                <UsersImg />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Agregar Tarea", { uid: route.params.uid })
              }
            >
              <View style={{ alignContent: "center" }}>
                <AgregarTareaImg />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>{
                if (canControl) {
                  navigation.navigate("Asignar Tareas", { uid: route.params.uid });
                }else{
                  alert('solo admin');
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
                if (canControl) {
                  navigation.navigate("Admin", {
                    uid: route.params.uid,
                  });
                }else{
                  alert('solo admin');
                }
                
              }}
            >
              <View style={{ marginLeft: 7}}>
                <MezclaImg />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={AreYouSureAlert}>
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
    [route.params.uidTask],
    [nTasks],
  );

const loadAllOrderedTasks = () => {
  if(!chargedOrderedTasks){
    
    if(tasksInSectors.length!=0){
      setChargedOrderedTasks(true);
      //filter allTasks
      const allOrderedTasks = [];
      orderedTasks.forEach(taskName => {
        for (let i = 0; i < tasksInSectors.length; i++) {
          const tasks = tasksInSectors[i];
            for (let j = 0; j < tasks.length; j++) {
              const task = tasks[j].task_name;
              if (task==taskName){
                allOrderedTasks.push(tasks[j])
                allDescTasks.push(tasks[j].task_description)
                j = tasks.length;
                i = tasksInSectors.length
              }
            }
        }
    });
    setAllOrderedTasks(allOrderedTasks);
    setAllDescTasks(allDescTasks)

    }
    
  }
}

  // Return HomeScreen
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            marginTop: 30,
            marginBottom: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CasaImg />
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

        {/* <TouchableOpacity onPress={logActiveTasks}>
            <Text>Ver tareas activas</Text>
          </TouchableOpacity> */}
        
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.subtitleSection}>
            Tareas de {taskUser} asignadas esta semana: {nTasks}{" "}
          </Text>
        </View>
        <View style={{ height: "60%", flex: 1 }}>
        {firsTask && loadAllOrderedTasks()}
          <SectionList
            sections={activeTasks}
            renderItem={(props) =>
              renderAssignedTasks(props, checkList, controlCheckList)
            }
            renderSectionHeader={({ section: { sector } }) => (
              <Text style={styles.SectionHeader}>{sector}</Text>
            )}
          />
          
          {/* <TouchableOpacity onPress={()=>{
              allDescTasks.forEach(element => {
                console.log(element);
              });
              }}>
            <Text>Ver Desc</Text>
          </TouchableOpacity> */}

            <TouchableOpacity
              style={{
                marginBottom: 30,
                marginTop: 10,
                backgroundColor: "#2d7ac0",
                alignItems: "center",
                alignSelf: "center",
                width: 80,
                borderWidth: 1,
                borderColor: "#000"
              }}
              onPress={() => {
                navigation.navigate("HistorialScreen", {
                  uid: route.params.uid,
                  uidTask: route.params.uidTask,
                  taskUser: taskUser,
                });
              }}
            >
              <HistorialImg />
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
