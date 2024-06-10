import { collection, getDocs } from "firebase/firestore";
import { db } from "./getFirebase";

export async function getAssignedTasks (groupCode) {
    const querySnapshot = await getDocs(collection(db, "groups", groupCode, "assigned_tasks"));
    let assignedTasks = []
    querySnapshot.forEach((doc) => {
        let objAssignedTask = {}
        objAssignedTask.timestamp = doc.data().timestamp
        objAssignedTask.uid = doc.data().uid
        objAssignedTask.timeLimit = doc.data().time_limit
        objAssignedTask.active_tasks = doc.data().active_tasks
        objAssignedTask.markedTasks = doc.data().marked_tasks
        objAssignedTask.controlMarkedTasks = doc.data().control_marked_tasks
        objAssignedTask.comment = doc.data().comment
        assignedTasks.push(objAssignedTask)
    });
    return assignedTasks
}
