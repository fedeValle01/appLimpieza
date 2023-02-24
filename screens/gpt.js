import React, { memo, useEffect, useState } from "react";
import {Text,SafeAreaView,TextInput,TouchableOpacity,Alert,View,SectionList,Image,} from "react-native";
import {doc,setDoc,getFirestore,collection,orderBy,onSnapshot,query,where,serverTimestamp,updateDoc,} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import { Checkbox } from "react-native-paper";


export default function HomeScreen({ navigation, route }) {
  console.log("render HomeScreen");
  const auth = getAuth(app);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [sectors, setSectors] = useState([]);
  const [user, setUser] = useState([]);
  const [taskUser, setTaskUser] = useState([]);

  //can mark check controlCheckList
  const [canControl, setCanControl] = useState(false);

  const [activeTasks, setActiveTasks] = useState([]);
  const [nTasks, setNTasks] = useState([]);
  const [checkList, setCheckList] = useState([]);
  const [controlCheckList, setControlCheckList] = useState([]);
  const [canCheckTask, setCanCheckTask] = useState(false);

  const [checked, setChecked] = useState([]);
  const [taskIndex, setTaskIndex] = useState(0);

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
      timestamp_marked_task: serverTimestamp(),
    });
  };
  
  const renderAssignedTasks = ({ item }) => {
    contador++;
    if (contador >= nTasks) {
      console.log("contador: " + contador + ">= ntareas: " + nTasks);
      contador = 0;
    }
    
    let i = contador;
 
    return (
      <View style={styles.viewSeccion}>
        <View>
          <Item title={item} />
        </View>
        <View style={{ flex: 1 }} />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>{i + 1}</Text>

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




  const Item = ({ title }) => (
    <View style={styles.itemSectionlist}>
      {/* onLongPress={() => alert('hola')} */}
      <Text style={styles.titleSectionlist}>{title}</Text>
    </View>
  );

  useEffect(
    () => {
      

      if (route.params.uid == route.params.uidTask) {
        //Es el usuario viendo sus tareas
        setCanCheckTask(true);
      } else {
        setCanCheckTask(false);
      }
      let contador = -1
      let q;
      let unsuscribe;
      let collectionRef = collection(db, "sectors");
      q = query(collectionRef, orderBy("sector_name", "asc"));

      console.log('entra useEfect');
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
          let nTasks = 0;
          let d = 0;
          activeTasks.forEach(element => {
            d = element.data;
            nTasks = nTasks + d.length;
          });
          // console.log('nTasks: '+ nTasks);
          setNTasks(nTasks);
        }
      });

      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("ya tienes sesión iniciada con:" + route.params.uid);
        }
        return unsuscribe;
      });
    },
    [route.params.uidTask],
    [nTasks]
  );

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
          <SectionList
            sections={activeTasks}
            renderItem={renderAssignedTasks}
            keyExtractor={(item, index) => item + index}
            renderSectionHeader={({ section: { sector } }) => (
              <Text style={styles.SectionHeader}>{sector}</Text>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
