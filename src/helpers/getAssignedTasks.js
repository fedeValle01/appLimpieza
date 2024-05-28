import { collection, getDocs } from "firebase/firestore";
import { db } from "./getFirebase";

export async function getAssignedTasks (groupCode) {
    const querySnapshot = await getDocs(collection(db, "groups", groupCode, "assigned_tasks"));
    let assignedTasks = []
    querySnapshot.forEach((doc) => {
        let objAssignedTask = {}
        objAssignedTask.uid = doc.data().uid
        objAssignedTask.active_tasks = doc.data().active_tasks
        objAssignedTask.control_marked_tasks = doc.data().control_marked_tasks
        objAssignedTask.marked_tasks = doc.data().marked_tasks
        assignedTasks.push(objAssignedTask)
    });
    return assignedTasks
}
