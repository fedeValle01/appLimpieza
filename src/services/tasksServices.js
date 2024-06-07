import { collection, getDocs } from "firebase/firestore";
import { db } from "../helpers/getFirebase";


export const getAllTasks = async () => {
        let tasks = []
        const querySnapshot = await getDocs(collection(db, "tasks"));
        querySnapshot.forEach((doc) => {
            let objTask = doc.data()
            objTask.id = doc.id
            tasks.push(objTask)
        });
        return tasks
}

export const getTaskBySearch = async (search) => {
    let tasks = await getAllTasks()
    const filteredTasks = tasks.filter(task => task.task_name.toLowerCase().includes(search.toLowerCase()))
    return filteredTasks
}
