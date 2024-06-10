import { doc, getDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "./getFirebase";

export async function getUsersUID(groupCode) {
    const docRef = doc(db, "groups", groupCode);
    const group = await getDoc(docRef);
    if (group.exists()) {
      return group.data().users
    } else {
      Alert.alert("No hay usuarios")
      console.log('no hay users');
      return ([])
    }
}