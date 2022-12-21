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
} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
import styles from "./stylesScreens";
import { Checkbox } from "react-native-paper";

console.log("setea contador -1");
let contador = -1;

export default function AutoAssignTask({ navigation, route }) {
  console.log("render AutoAssignTask");
  contador = -1;
  const auth = getAuth(app);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [sectors, setSectors] = useState([]);
  const [user, setUser] = useState([]);

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

  const saveAssignedTasks = async () => {
    let tskRef = collection(db, "assigned_tasks");
    let q = query(tskRef);
    let unsuscribe = onSnapshot(q, (querySnapshot) => {
      let assignedTasks = querySnapshot.docs.map((doc) => ({
        tasks: doc.data().active_tasks,
        uid: doc.data().uid,
        control_marked_tasks: doc.data().control_marked_tasks,
        timestamp: serverTimestamp(),
      }));
      assignedTasks.forEach(async (element) => {
        let historyRef = doc(
          collection(db, "assigned_tasks", element.uid, "history")
        );
        await setDoc(historyRef, element);
      });
    });
    return unsuscribe;
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
        console.log("u: " + element.name);
        setUser(element.name);
        setCanControl(element.canControl);
      });
    });
  }, []);

  // Return AutoAssignTaskScreen
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#cdcdcd",
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
          onPress={() => {
            console.log("hola");
          }}
          style={styles.btnUsuario}
        >
          <Text style={styles.txtUser}>Asignar tareas automaticamente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            alert("usuarios: " + user);
          }}
          style={styles.btnUsuario}
        >
          <Text style={styles.txtUser}>ver usuarios</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
