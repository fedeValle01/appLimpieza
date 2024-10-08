import { addDoc, collection, doc, getDocs, orderBy, query, where, writeBatch } from "firebase/firestore";
import { db } from "./getFirebase";
import { Alert } from "react-native";
import { getDateLastWeek } from "./getDateLastWeek";



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


const getLastWeekRecords = async (groupCode) => {
    const collectionRef = collection(db, 'groups', groupCode, 'records');
    const lastWeek = getDateLastWeek()
    const q = query(collectionRef, where("time_limit", ">=", lastWeek), orderBy('time_limit', 'asc'))

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
  const batch = writeBatch(db);
  const records = await getLastWeekRecords(groupCode)
  console.log(records);

  const commitBatch = async () => {
    let response = ''
    await batch.commit().then((res) => {
      console.log(res);
    })
    return response
  }

    const docRefs = AssignedTasks.map(() => doc(collection(db, "groups", groupCode, "records")))

    docRefs.forEach((docRef, index) => {
      // console.log('clave');
      // console.log(docRef);
      // console.log('valor');
      const record = AssignedTasks[index]
      const uid = record.uid
      const sameHistory = records.filter(history => history.uid == uid)
      if(sameHistory.length > 0) {
        console.log(uid+' se encontro en');
        console.log(sameHistory);
      }else{
        batch.set(docRef, AssignedTasks[index]);
        console.log(uid+'es nuevo');
      }
      
    });
    const res = await commitBatch()
    console.log(res);


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