import { doc, getDoc } from "firebase/firestore";
import { db } from "./getFirebase";
import { Alert } from "react-native";

export async function getUserList(usersUID) {
  let usersList = [];
  try {
    for (const user of usersUID) {
      const docRef = doc(db, "user", user);
      const sfDoc = await getDoc(docRef);

      if (!sfDoc.exists()) {
        console.log('no hay users');
        throw new Error("Document does not exist!");
      } else {
        let objUser = {};
        objUser.username = sfDoc.data().username;
        objUser.in_home = sfDoc.data().in_home;
        objUser.uid = sfDoc.data().uid;
        objUser.canControl = sfDoc.data().can_control;
        objUser.sectors = [];
        usersList.push(objUser);
      }
    }
  } catch (e) {
    console.log(e);
  }
  return usersList;
}
