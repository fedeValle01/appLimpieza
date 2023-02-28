import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { doc, setDoc, getFirestore } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  getIdToken,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function AddSector({ navigation, route }) {
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateSector = async () => {
    console.log("Sector: " + sector);
    console.log("Sector description : " + description);

    // Add a new document in collection "sectors"
    // Get a list of sectors from your database
    await setDoc(doc(db, "sectors", sector), {
      sector_name: sector,
      sector_description: description,
    }).then(Alert.alert("Sector Creado"));
  };

  const logOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        alert("Session cerrada");
        navigation.navigate("Login");
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text>Nombre sector</Text>
      <TextInput
        placeholder="Nombre sector"
        onChangeText={(text) => setSector(text)}
      ></TextInput>
      <Text>Descripcion sector</Text>
      <TextInput
        placeholder="Descripcion"
        onChangeText={(text) => setDescription(text)}
      ></TextInput>

      <TouchableOpacity onPress={handleCreateSector}>
        <Text>Crear sector</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
