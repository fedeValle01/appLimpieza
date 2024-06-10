import { addDoc, collection, doc, getDocs, orderBy, query, writeBatch } from "firebase/firestore";
import { db } from "./getFirebase";
import { Alert } from "react-native";

const batch = writeBatch(db);


const hasSaveHistory = () => { //check if the last history is saved
  //foreach assigned_tasks
  let cont = 0;
  let setHistory = [];
  let objHistory = {};
  assigned_tasks.forEach(async (element) => {
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
    //If the current assigned task has the same timestamp as one from the history, go to nextWeek.
    if (hasEven) {
      console.log('el historial esta guardado');
      //go nextWeek
    }else{

      const saveHistory = async (history, uid) => {
        await updateDoc(doc(db, "assigned_tasks", uid), {
          history,
        }).catch((error) => {
          alert(error);
        });
      }

      objHistory.data = element.active_tasks;
      objHistory.control_marked_tasks = element.control_marked_tasks;
      objHistory.marked_tasks = element.marked_tasks;

      //just push actual assigned task and his data in history
      setHistory.push(objHistory);
      let history = setHistory;
      let uid = element.uid
      Alert.alert("El historial no esta guardado", "Quiere guardarlo?", [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: saveHistory(history, uid) }, //TESTEAR ESTO
      ])


      
      

  }
  });
}


const getAllrecords = async (groupCode) => {
    const collectionRef = collection(db, 'groups', groupCode, 'records');
    const q = query(collectionRef, orderBy('timestamp', 'asc'))

    let records = []
    const recordsQuery = await getDocs(q);
    recordsQuery.forEach((doc) => {
      let objHistory = {}
      objHistory.id = doc.data.id
      objHistory.uid = doc.data().uid
      objHistory.active_tasks = doc.data().active_tasks
      objHistory.control_marked_tasks = doc.data().control_marked_tasks
      objHistory.marked_tasks = doc.data().marked_tasks
      objHistory.time_limit = doc.data().time_limit
      objHistory.timestamp = doc.data().timestamp
      objHistory.timestamp_marked_tasks = doc.data().timestamp_marked_tasks
      objHistory.timestamp_control_marked_tasks = doc.data().timestamp_control_marked_tasks
      records.push(objHistory)
    });
    return records
}



export const saveAllHistory = async (groupCode, AssignedTasks) => {
  // bussiness rule: para guardar un historial, no tiene que haberse guardado esa semana
  // semana persona
  const records = await getAllrecords(groupCode)
  console.log(records);
  const commitBatch = async () => {
        await batch.commit().then(() => {
          Alert.alert('Historial guardado con exito!')
        })
    }

    // const docRefs = AssignedTasks.map(() => doc(collection(db, "groups", groupCode, "records")))

    // docRefs.forEach((docRef, index) => {
    //   // console.log('clave');
    //   // console.log(docRef);
    //   // console.log('valor');
    //   // console.log(AssignedTasks[index]);
    //   batch.set(docRef, AssignedTasks[index]);
    // });
    // commitBatch()


    //   AssignedTasks.forEach((element) => {
    //     let setHistory = [];
    //     let objHistory = {};
        
    //     console.log("col: ", element);
  
    //     objHistory.timestamp = element.timestamp;
  
    //     let hasEven = false;
    //     if (element.history) {
    //       setHistory = element.history;
    //       hasEven = setHistory.some(
    //         (h) => String(h.timestamp) == String(objHistory.timestamp)
    //       );
    //     }
    //     //If the current assigned task has the same timestamp as one from the history, do nothing.
    //     if (!hasEven && element.active_tasks) {
          
    //       objHistory.data = element.active_tasks;
    //       objHistory.control_marked_tasks = element.control_marked_tasks;
    //       objHistory.marked_tasks = element.marked_tasks;
    //       objHistory.uid = element.uid;
    //       //just push actual assigned task and his data in history
    //       setHistory.push(objHistory);
    //       let history = setHistory;
    //       console.log('HISTORY REEMP');
    //       console.log(history);
          
    //       if (objHistory) batch.set(addDoc(collection(db, "groups", route.params.groupCode, "records"), {
    //         name: "jamon"
    //       }))
  
    //     }
    //   });
}