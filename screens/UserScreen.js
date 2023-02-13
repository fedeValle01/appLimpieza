import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  querySnapshot,
  getDocs,
  orderBy,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";

export default function TaskScreen({ navigation, route }) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [user, setUser] = useState([]);

  function ListItem(props) {
    return (
      <SafeAreaView>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("appLimpieza", {
              uid: route.params.uid,
              uidTask: props.uid,
            });
          }}
          style={styles.btnUsuario}
        >
          <Text style={styles.txtUser}>{props.value} </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const SectorList = (props) => {
    let users = props.users;
    let arregloNombres = [];
    let arregloUid = [];

    if (users != "") {
      users.forEach((user, i) => {
        arregloNombres[i] = user.username;
        arregloUid[i] = user.uid;
      });

      return (
        <Text>
          {arregloNombres.map((nombre, i) => (
            <ListItem
              key={nombre.toString()}
              value={nombre}
              uid={arregloUid[i]}
            />
          ))}
        </Text>
      );
    } else {
      console.log("no hay usuarios");
    }
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        alert("Session cerrada");
        navigation.navigate("Iniciar Sesion");
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    const collectionRef = collection(db, "user");
    const q = query(collectionRef, orderBy("username", "asc"));

    const unsuscribe = onSnapshot(q, (querySnapshot) => {
      setUser(
        querySnapshot.docs.map((doc) => ({
          username: doc.data().username,
          uid: doc.data().uid,
        }))
      );
    });

    return unsuscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          width: "80%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Text style={styles.subtitleSection}>
            {" "}
            Ver tareas asignadas de los usuarios:
          </Text>
        </View>
        <SectorList users={user} />
      </View>
    </SafeAreaView>
  );
}
