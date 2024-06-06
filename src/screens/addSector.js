import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { doc, setDoc, getFirestore, addDoc, collection } from "firebase/firestore"; // Follow this pattern to import other Firebase services
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
import { db } from "../helpers/getFirebase";

export default function AddSector({ navigation, route }) {
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateSector = async () => {
    console.log("Sector: " + sector);
    console.log("Sector description : " + description);

    await addDoc(collection(db, "groups", route.params.groupCode, "sectors"), { //Terreneitor
      sector_name: sector,
      sector_description: description,
    }).then(Alert.alert("Sector creado con exito"));
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
