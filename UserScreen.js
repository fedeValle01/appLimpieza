import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
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
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";

export default function TaskScreen({ navigation, route }) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [users, setUsers] = useState([]);


  const changeOnHome = async (uid, inHome) =>{
    console.log('uid: '+ uid);
    await updateDoc(doc(db, "user", uid), {
      in_home: !inHome,
    });
  }

  const ListItem = (props) => {
    return (
      <SafeAreaView>
        <TouchableOpacity
          style={styles.btnUsuario}

          onPress = {() => {
            navigation.navigate("appLimpieza", {
              uid: route.params.uid,
              uidTask: props.uid,
            });
          }}

          onLongPress = {() => {
            if(route.params.canControl){
              changeOnHome(props.uid, props.inHome)
            }
          }}
        >
          <Text style={styles.txtUser}>{props.value} </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const SectorList = (props) => {
    let users = props.users;
    let namesInHome = [];
    let UidsInHome = [];
    let namesOutHome = [];
    let UidsOutHome = [];

    if (users != "") {
      let indexInHome = 0;
      let indexOutHome = 0;

      users.forEach((user) => {
        if(user.in_home){
          namesInHome[indexInHome] = user.username;
          UidsInHome[indexInHome] = user.uid;
          indexInHome++;
        }else{
          namesOutHome[indexOutHome] = user.username;
          UidsOutHome[indexOutHome] = user.uid;
          indexOutHome++;
        }
        
      });

      return (
        <View>
          <Text style={styles.inHouseTitle}>En casa</Text>
          <Text>
            {namesInHome.map((nombre, i) => (
              <ListItem
                key={nombre.toString()}
                value={nombre}
                inHome={true}
                uid={UidsInHome[i]}
              />
            ))}
          </Text>

          <Text style={styles.inHouseTitle}>Fuera de casa</Text>
          <Text>
            {namesOutHome.map((nombre, i) => (
              <ListItem
                key={nombre.toString()}
                value={nombre}
                inHome={false}
                uid={UidsOutHome[i]}
              />
            ))}
          </Text>
        </View>
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
      setUsers(
        querySnapshot.docs.map((doc) => ({
          username: doc.data().username,
          uid: doc.data().uid,
          in_home: doc.data().in_home,
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
        <SectorList users={users} />
      </View>
    </SafeAreaView>
  );
}
