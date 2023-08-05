import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  SectionList,
  Image,
} from "react-native";
import {
  doc,
  setDoc,
  getFirestore,
  collection,
  orderBy,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  deleteField,
  updateDoc,
  addDoc,
  getDoc,
} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
import styles from "./stylesScreens";
import { Checkbox } from "react-native-paper";

console.log("Refresh AutoAssignTaskScreen");

export default function AutoAssignTask({ navigation, route }) {
  console.log("render AutoAssignTask");
  const auth = getAuth(app);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [sectors, setSectors] = useState([]);
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);

  const [colAssignedTasks, setColAssignedTasks] = useState([]);

  //can mark check controlCheckList
  const [canControl, setCanControl] = useState(false);

  const [markedTasks, setMarkedTasks] = useState([]);
  const [checkList, setCheckList] = useState([]);
  const [controlCheckList, setControlCheckList] = useState([]);
  const [canCheckTask, setCanCheckTask] = useState(false);

  const [checked, setChecked] = useState([]);

  const AreYouSureAlert = () => {
    return Alert.alert("Va a cerrar sesion", "Esta seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: logOut },
    ]);
  };
  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Iniciar Sesion");
      })
      .catch((error) => {
        alert(error);
      });
  };





  const autoAssign = () => {

    //Shuffle users
    users.sort(function () {
      return 0.5 - Math.random();
    });

      let contAssigned = 0;
      sectors.forEach((sector, i) => {
         

        console.log("vuelta "+i+" bucle sector");
        console.log(" ");

        if (sector.sector_name != "Otro") {
          if (contAssigned < users.length) {  // Por cada usuario 1 sector
          let user = {};
          user = users[contAssigned];
          console.log('usuario: '+user.username);

          let uidUser;
          uidUser = user.uid;


          let active_tasks = [];
          let objTask = {};
          let getTasks = [];
          let tasks = [];
          let collectionRef = collection(db, "tasks");
          let q = query (collectionRef, where("task_sector", "==", sector.sector_name));
          let unsuscribe = onSnapshot(q, async (querySnapshot) => {
            getTasks = querySnapshot.docs.map((doc) => ({
              task_name: doc.data().task_name,
            }));

            
            getTasks.forEach((task, i) => {
              tasks[i] = task.task_name;
            });
            
            let markedd = [];
            let checkIndex = 0;

            
            console.log('Tareas del sector '+ sector.sector_name+': ');
            console.log(' ');
            tasks.forEach((element, i) => {
              console.log('Tarea '+i+': '+element);
            });

            objTask.data = tasks;
            objTask.sector = sector.sector_name;
            active_tasks.push(objTask);

            active_tasks.forEach((s) => {
              s.data.forEach((task) => {
                markedd[checkIndex] = "unchecked";
                checkIndex++;
              });
            });
            
            console.log('tareas marcadas unchecked');
            checkIndex = 0;
            const docRef = doc(db, "assigned_tasks", uidUser);
            const docSnap = await getDoc(docRef);

        // if exist update
        if (docSnap.exists()) {
          console.log('doc exist, asignar tareas de '+ uidUser);
          await updateDoc(doc(db, "assigned_tasks", uidUser), {
            active_tasks: active_tasks,
            marked_tasks: markedd,
            control_marked_tasks: markedd,
            timestamp: serverTimestamp(),
            uid: uidUser,
            // time_limit: date,
          })
        } else {
          console.log('doc no existe, asignar tareas de '+ uidUser);
          await setDoc(doc(db, "assigned_tasks", uidUser), {
            active_tasks: active_tasks,
            marked_tasks: markedd,
            control_marked_tasks: markedd,
            timestamp: serverTimestamp(),
            uid: uidUser,

            // time_limit: date,
          })
        }
          });
          contAssigned++;
        }
      }
    });
  };
  const AreYouSureDelete = () => {
    return Alert.alert("Va a eliminar Historial y Tareas asignadas", "Esta seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: deleteAllHistory },
    ]);
  }

  const deleteAllHistory = () => {
    colAssignedTasks.forEach(async (element) => {
      let ref = doc(db, "assigned_tasks", element.uid);

      await updateDoc(ref, {
        active_tasks: deleteField(),
        control_marked_tasks: deleteField(),
        marked_tasks: deleteField(),
        time_limit: deleteField(),
        timestamp: deleteField(),
        uid: deleteField(),
      });
    });
  };

  const saveAssignedTasks = () => {
    //foreach assigned_tasks
    let cont = 0;
    let setHistory = [];
    let objHistory = {};
    colAssignedTasks.forEach(async (element) => {
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
      //If the current assigned task has the same timestamp as one from the history, do nothing.
      if (!hasEven) {
        objHistory.data = element.active_tasks;
        objHistory.control_marked_tasks = element.control_marked_tasks;
        objHistory.marked_tasks = element.marked_tasks;

        //just push actual assigned task and his data in history
        setHistory.push(objHistory);
        let history = setHistory;

        await updateDoc(doc(db, "assigned_tasks", element.uid), {
          history,
        }).catch((error) => {
          alert(error);
        });
      }
    });
  };

  useEffect(() => {
    if (route.params.uid == route.params.uidTask) {
      //Es el usuario viendo sus tareas
      setCanCheckTask(true);
    } else {
      setCanCheckTask(false);
    }
    let q;
    let unsuscribe;
    let collectionRef = collection(db, "sectors");
    q = query(collectionRef, orderBy("sector_name", "asc"));

    unsuscribe = onSnapshot(q, (querySnapshot) => {
      setSectors(
        querySnapshot.docs.map((doc) => ({
          sector_name: doc.data().sector_name,
          sector_description: doc.data().sector_description,
        }))
      );
    });

    collectionRef = collection(db, "assigned_tasks");
    let ColAssignedTasks = [];
    q = query(collectionRef);

    // get assigned_tasks
    unsuscribe = onSnapshot(q, (querySnapshot) => {
      setColAssignedTasks(
        querySnapshot.docs.map((doc) => ({
          uid: doc.data().uid,
          active_tasks: doc.data().active_tasks,
          control_marked_tasks: doc.data().control_marked_tasks,
          marked_tasks: doc.data().marked_tasks,
          timestamp: doc.data().timestamp,
          history: doc.data().history,
        }))
      );
    });

    //set username
    let u;
    collectionRef = collection(db, "user");
    q = query(collectionRef, where("uid", "==", route.params.uid));
    unsuscribe = onSnapshot(q, (querySnapshot) => {
      u = querySnapshot.docs.map((doc) => ({
        name: doc.data().username,
        canControl: doc.data().can_control,
      }));

      u.forEach((element) => {
        console.log("u: " + element.name);
        setUser(element.name);
        setCanControl(element.canControl);
      });
    });

    //set users
    collectionRef = collection(db, "user");
    q = query(collectionRef);
    unsuscribe = onSnapshot(q, (querySnapshot) => {
      u = querySnapshot.docs.map((doc) => ({
        username: doc.data().username,
        uid: doc.data().uid,

        canControl: doc.data().can_control,
      }));

      setUsers(u);
    });
  }, []);

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
        <TouchableOpacity
          onPress={saveAssignedTasks}
          style={[styles.btnUsuario, { backgroundColor: "#c0f" }]}
        >
          <Text style={styles.txtUser}>Guardar en el historial</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={AreYouSureDelete}
          style={[styles.btnUsuario, { backgroundColor: "#cb3234" }]}
        >
          <Text style={styles.txtUser}>
            Eliminar historial y tareas asignadas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={autoAssign} style={styles.btnUsuario}>
          <Text style={styles.txtUser}>Asignar tareas automaticamente</Text>
        </TouchableOpacity>
        

        <TouchableOpacity
          onPress={() => {
            for (let i = 0; i < 6; i++) {
              const element = users[i];
  
              console.log("pos "+ i+': ' + element.uid);
            }
          }}
          style={styles.btnUsuario}
        >
          <Text style={styles.txtUser}>log usuarios</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}