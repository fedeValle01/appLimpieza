import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  SectionList,
  View,
} from "react-native";
import {
  doc,
  setDoc,
  getFirestore,
  collection,
  orderBy,
  query,
  where,
  onSnapshot,
} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function HistorialScreen({ navigation, route }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let q;
    let unsuscribe;
    let collectionRef = collection(db, "assigned_tasks");

    q = query(collectionRef, where("uid", "==", route.params.uidTask));

    unsuscribe = onSnapshot(q, (querySnapshot) => {
      let qhistory = querySnapshot.docs.map((doc) => ({
        history: doc.data().history,
        uid: doc.data().uid,
      }));

      if (qhistory) {
        console.log("hay hist");

        qhistory.forEach((element) => {
          setHistory(element.history);
        });
      }
    });
  }, []);

  const logHistory = () => {
    console.log("history: " + history);
    history.forEach((element) => {
      let dateTime = element.timestamp.toDate();
      dateTime.setUTCHours(dateTime.getUTCHours() + 2);
      let timestampDate = dateTime;
      console.log("timestamp:" + dateTime);
      console.log("day of month:" + dateTime.getDate());
      console.log("day of week:" + dateTime.getDay());

      let firstDay = new Date(
        dateTime.getFullYear(),
        dateTime.getMonth(),
        dateTime.getDate() - dateTime.getDay() + 1
      );
      // Get the last day of the week
      let lastDay = new Date(
        dateTime.getFullYear(),
        dateTime.getMonth(),
        dateTime.getDate() + (7 - dateTime.getDay())
      );
      console.log(
        "semana del " +
          firstDay.getDate() +
          "/" +
          firstDay.getMonth() +
          1 +
          "/" +
          firstDay.getFullYear() +
          " al " +
          lastDay.getDate() +
          "/" +
          lastDay.getMonth() +
          1 +
          "/" +
          lastDay.getFullYear()
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Hola historial de {route.params.taskUser} </Text>

        <View style={{ height: "60%", flex: 1 }}>
          {/* <SectionList
            sections={activeTasks}
            renderItem={renderAssignedTasks}
            renderSectionHeader={({ section: { sector } }) => (
              <Text style={styles.SectionHeader}>{sector}</Text>
            )}
          /> */}
          {/* modificar esto para que muestre el historial, desde mas reciente hasta antiguo
            mostrando la semana por ejemplo "Historial desde 23/01 hasta 30/01" */}
        </View>

        <TouchableOpacity onPress={logHistory}>
          <Text>Ver historial</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
