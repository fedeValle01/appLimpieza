import { memo, useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../stylesScreens";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import firebaseConfig from "../../firebase-config";
import { initializeApp } from "firebase/app";

const TaskView = ({ task }) => {

    const [showTask, setShowTask] = useState(true)

    const [taskName, setTaskName] = useState(task.taskName)
    const [id, setId] = useState(task.id)
    const [defaultAssigned, setDefaultAssigned] = useState(task.defaultAssigned)

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    useEffect(() => {
      // console.log('TaskView');
      // console.log(id);
      
    }, [defaultAssigned])

    const areYouSureDeleteTask = (task) => {
      console.log('aresure');
        return Alert.alert("Vas a eliminar la tarea "+task.taskName, "Estas seguro?", [
          {
            text: "Cancelar",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },    
          { text: "OK", onPress: () => deleteTask(task) }
        ]);
    }
    
    const deleteTask = async (task) =>{
      deleteDoc(doc(db, "tasks", task.id)).then(() => {
        Alert.alert('Se elimino la tarea '+ task.taskName+' con exito')
        setShowTask(false)

      });
    }

    const DeleteImg = memo(() => (
      <Image
            style={{ width: 25, height: 25 }}
            source={require("../../assets/tachoBasura.png")}
      />
    )
    );

    const changeDefault = async () => {
      console.log('se cambia ');
      const ref = doc(db, "tasks", id);
      setDefaultAssigned(!defaultAssigned)
      
      await updateDoc(ref, {default_assigned: !defaultAssigned})
    }

    if (showTask) return (
        <View style={[styles.viewSeccion, {backgroundColor: !defaultAssigned ? "#cecece" : "#fff"}]}>
          <View style={[styles.itemSectionlist, {width:"60%"}]}>
            <Text style={[styles.titleSectionlist, !defaultAssigned ? styles.titleSectionlistDisabled : ""]}>{taskName}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", position: "absolute", right: 10}}>
            {defaultAssigned && <TouchableOpacity onPress={changeDefault}><Text style={styles.pActive}>activo</Text></TouchableOpacity>}
            {!defaultAssigned && <TouchableOpacity onPress={changeDefault}><Text style={styles.pActive}>inactivo</Text></TouchableOpacity>}
            <View>
              <TouchableOpacity onPress={() => areYouSureDeleteTask(task)}>
                <DeleteImg />
              </TouchableOpacity>
            </View>
          </View>
        </View>
    )
  }
export default memo(TaskView);