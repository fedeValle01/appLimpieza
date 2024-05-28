import React, { useEffect, useState, memo } from "react";
import { Text, SafeAreaView, TouchableOpacity, Alert, View, Image} from "react-native";
import { doc, writeBatch, setDoc, getFirestore, collection, orderBy, onSnapshot, query, where, serverTimestamp, deleteField, updateDoc, addDoc, getDoc} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
import styles from "./stylesScreens";

// Get a new write batch

console.log("Refresh AutoAssignTaskScreen");

export default function AdminScreen({ navigation, route }) {
  console.log("render AutoAssignTask");
  const auth = getAuth(app);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const batch = writeBatch(db);
  const [sectors, setSectors] = useState([]);
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersInHome, setUsersInHome] = useState([]);
  const [usersOutHome, setUsersOutHome] = useState([]);
  const [colAssignedTasks, setColAssignedTasks] = useState([]);
  
  const AreYouSaveAssignedTasks = () => {
    return Alert.alert("Va a guardar en el historial todas las tareas asignadas actualmente", "Esta seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: saveAssignedTasks },
    ]);
  }
  
  const AreYouSureAssign = () => {
    return Alert.alert("Asignar sectores aleatoriamente a todos los usuarios que se esten en la casa", "Esta seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: autoAssign },
    ]);
  }
    
  const AreYouSureDeleteHistory = () => {
    return Alert.alert("Eliminar historial de todos los usuarios", "Estas seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: deleteAllHistory },
    ]);
  }

  
  const AreYouSureLogOut = () => {
    return Alert.alert("Vas a cerrar sesion", "Esta seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: logOut },
    ]);
  }

  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Iniciar Sesion");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const LogOutImg = memo(() =>(
    <Image
      style={{ width: 27, height: 27 }}
      source={require("../assets/cerrar-sesion.png")}
    />
))

  const AreYouSureDeleteAssignedTasks = () => {
    return Alert.alert("Eliminar todas las tareas asignadas de los usuarios", "Estas seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: deleteAllAssignedTasks },
    ]);
  }

  const getListSectors = (nUsers) =>{
    let ListSectors = []
    switch (nUsers) {
      case 11:
      ListSectors = ['Cocina', 'Cocina', 'Baño 1', 'Baño 2', 'Baño 3', 'Patio Interno', 'Patio Externo', 'Lavaderos', 'Sala de Estudio', 'Vereda', 'Otro'];
      break;
      case 10:
      ListSectors = ['Cocina', 'Cocina', 'Baño 1', 'Baño 2', 'Baño 3', 'Patio Interno', 'Patio Externo', 'Lavaderos', 'Sala de Estudio', 'Vereda'];
      break;
      case 9:
      ListSectors = ['Cocina', 'Cocina', 'Baño 1', 'Baño 2', 'Baño 3', 'Patio Interno', 'Patio Externo', 'Lavaderos', 'Sala de Estudio'];
      break;
      case 8:
      ListSectors = ['Cocina', 'Cocina', 'Baño 1', 'Baño 2', 'Baño 3', 'Patio Interno', 'Patio Externo', 'Sala de Estudio'];
      break;
      case 7:
      ListSectors = ['Cocina', 'Cocina', 'Baño 1', 'Baño 2', 'Baño 3', 'Patio Interno', 'Patio Externo'];
      break;
      case 6:
      ListSectors = ['Cocina', 'Cocina', 'Baño 1', 'Baño 2', 'Baño 3', 'Patio Interno'];
      break;
      case 5: 
      ListSectors = ['Cocina', 'Baño 1', 'Baño2', 'Baño 3', 'Patio Interno']
      break;
      case 4:
      ListSectors = ['Cocina', 'Baño 1', 'Baño2', 'Patio Interno']
      break;
      default:
      console.log('Número no válido');
      break;
      }
    return ListSectors
  }

  
  const GoToAutoAssign = () => {
    navigation.navigate("Asignar Tareas Automaticamente", {
      user: user,
      users: users,
      usersInHome: usersInHome,
      usersOutHome: usersOutHome,
      colAssignedTasks: colAssignedTasks,
      sectors: sectors,
    });
  }

  const GoToTasksScreen = () => {
    navigation.navigate("Tareas", {
      user: user,
      users: users,
      usersInHome: usersInHome,
      usersOutHome: usersOutHome,
      colAssignedTasks: colAssignedTasks,
      sectors: sectors,
    });
  }

  const GoToStockScreen = () => {
    navigation.navigate("Stock", {
      uid: route.params.uid,
      uidTask: route.params.uidTask,
      user: user,
      users: users,
      usersInHome: usersInHome,
      usersOutHome: usersOutHome,
      canControl: route.params.canControl
    });
  }

  
  

  const autoAssign = () => {
    usersInHome.sort(function () {  //Shuffle users
      return 0.5 - Math.random();
    });
    let listSectors = getListSectors(usersInHome.length)

      listSectors.forEach((sector, i) => {
         
        console.log("vuelta "+i+" bucle sector");
        console.log(" ");

          let user = {};
          user = usersInHome[i];
          console.log('usuario: '+user.username);

          let uidUser;
          uidUser = user.uid;


          let active_tasks = [];
          let objTask = {};
          let getTasks = [];
          let tasks = [];
          let collectionRef = collection(db, "tasks");
          let q = query (collectionRef, where("task_sector", "==", sector));
          let unsuscribe = onSnapshot(q, async (querySnapshot) => {
            getTasks = querySnapshot.docs.map((doc) => ({
              task_name: doc.data().task_name,
            }));
            
            getTasks.forEach((task, i) => {
              tasks[i] = task.task_name;
            });
            
            let markedd = [];
            let checkIndex = 0;

            
            console.log('Tareas del sector '+ sector+': ');
            console.log(' ');
            tasks.forEach((element, i) => {
              console.log('Tarea '+i+': '+element);
            });

            objTask.data = tasks;
            objTask.sector = sector;
            active_tasks.push(objTask);

            active_tasks.forEach((s) => {
              s.data.forEach((task) => {
                markedd[checkIndex] = "unchecked";
                checkIndex++;
              });
            });
            
            console.log('tareas marcadas unchecked');
            checkIndex = 0;
            const docRef = doc(db, "assigned_tasks", uidUser);
            const docSnap = await getDoc(docRef);

        // if exist update
        if (docSnap.exists()) {
          console.log('doc exist, asignar tareas de '+ uidUser);
          await updateDoc(doc(db, "assigned_tasks", uidUser), {
            active_tasks: active_tasks,
            marked_tasks: markedd,
            control_marked_tasks: markedd,
            timestamp: serverTimestamp(),
            uid: uidUser,
            // time_limit: date,
          })
        } else {
          console.log('doc no existe, asignar tareas de '+ uidUser);
          await setDoc(doc(db, "assigned_tasks", uidUser), {
            active_tasks: active_tasks,
            marked_tasks: markedd,
            control_marked_tasks: markedd,
            timestamp: serverTimestamp(),
            uid: uidUser,

            // time_limit: date,
          })
        }
          });
    });
  };

  const commitBatchDelete = async () => {
    await batch.commit().then(() => {
      Alert.alert('Historial borrado con exito!')
    })
  }

  const deleteAllHistory = () => {
    colAssignedTasks.forEach((element) => {
      let ref = doc(db, "assigned_tasks", element.uid);
      batch.update(ref, {
        history: deleteField(),
      });
    });
    commitBatchDelete();
  }

  const deleteAllAssignedTasks = () => {
    colAssignedTasks.forEach(async (element) => {
      let ref = doc(db, "assigned_tasks", element.uid);

      await updateDoc(ref, {
        active_tasks: deleteField(),
        control_marked_tasks: deleteField(),
        marked_tasks: deleteField(),
        time_limit: deleteField(),
        timestamp: deleteField(),
        timestamp_control_marked_tasks: deleteField(),
        timestamp_marked_tasks: deleteField(),

      });
    });
  }

  const saveAssignedTasks = () => {
    
    const commitBatch = async () => {
      await batch.commit().then(() => {
        Alert.alert('Historial guardado con exito!')
      })
    }


    colAssignedTasks.forEach((element) => {
      let setHistory = [];
      let objHistory = {};
      
      console.log("col: ",element);

      objHistory.timestamp = element.timestamp;

      let hasEven = false;
      if (element.history) {
        setHistory = element.history;
        hasEven = setHistory.some(
          (h) => String(h.timestamp) == String(objHistory.timestamp)
        );
      }
      //If the current assigned task has the same timestamp as one from the history, do nothing.
      if (!hasEven && element.active_tasks) {
        
        objHistory.data = element.active_tasks;
        objHistory.control_marked_tasks = element.control_marked_tasks;
        objHistory.marked_tasks = element.marked_tasks;

        //just push actual assigned task and his data in history
        setHistory.push(objHistory);
        let history = setHistory;
        console.log('HISTORY REEMP');
        console.log(history);

          
        batch.update(doc(db, "assigned_tasks", element.uid), { history: history });


      }
    });
    commitBatch();
    

  };

  useEffect(() => {
    
    let q;
    let unsuscribe;
    let collectionRef = collection(db, "sectors");
    q = query(collectionRef, orderBy("sector_name", "asc"));

    unsuscribe = onSnapshot(q, (querySnapshot) => {
      setSectors(
        querySnapshot.docs.map((doc) => ({
          sector_name: doc.data().sector_name,
          sector_description: doc.data().sector_description,
        }))
      );
    });

    collectionRef = collection(db, "assigned_tasks");
    q = query(collectionRef);

    // get assigned_tasks
    unsuscribe = onSnapshot(q, (querySnapshot) => {
      setColAssignedTasks(
        querySnapshot.docs.map((doc) => ({
          uid: doc.data().uid,
          active_tasks: doc.data().active_tasks,
          control_marked_tasks: doc.data().control_marked_tasks,
          marked_tasks: doc.data().marked_tasks,
          timestamp: doc.data().timestamp,
          history: doc.data().history,
        }))
      );
    });

    //set username
    let u;
    collectionRef = collection(db, "user");
    q = query(collectionRef, where("uid", "==", route.params.uid));
    unsuscribe = onSnapshot(q, (querySnapshot) => {
      u = querySnapshot.docs.map((doc) => ({
        name: doc.data().username,
      }));

      u.forEach((element) => {
        console.log("u: " + element.name);
        setUser(element.name);
      });
    });

    //set users
    collectionRef = collection(db, "user");
    q = query(collectionRef);
    unsuscribe = onSnapshot(q, (querySnapshot) => {
      u = querySnapshot.docs.map((doc) => ({
        in_home: doc.data().in_home,
        username: doc.data().username,
        uid: doc.data().uid,
        canControl: doc.data().can_control,
        expoPushToken: doc.data().expoPushToken,
      }));

      let usersInHome = [];
      let usersOutHome = [];
      u.forEach(user => {
        if (user.in_home){
          usersInHome.push(user)
        }
        if (user.in_home == false){
          usersOutHome.push(user)
        }
      });
      setUsersOutHome(usersOutHome)
      setUsersInHome(usersInHome)
      setUsers(u);
    });
  }, []);

  // Return AutoAssignTaskScreen
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <TouchableOpacity onPress={AreYouSureAssign} style={styles.btnUsuario}>
          <Text style={styles.txtUser}>Asignar tareas automaticamente</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={GoToAutoAssign} style={styles.btnUsuario}>
          <Text style={styles.txtUser}>Pasar de semana</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={GoToTasksScreen} style={styles.btnUsuario}>
          <Text style={styles.txtUser}>Ver todas las tareas</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={GoToStockScreen} style={[styles.btnUsuario, { backgroundColor: "#008fff" }]}>
          <Text style={styles.txtUser}>Stock de limpieza ✨</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={AreYouSaveAssignedTasks}
          style={[styles.btnUsuario, { backgroundColor: "#c0f" }]}
        >
          <Text style={styles.txtUser}>Guardar en el historial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={AreYouSureDeleteHistory}
          style={[styles.btnUsuario, { backgroundColor: "#cb3234" }]}
        >
          <Text style={styles.txtUser}>Eliminar historial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={AreYouSureDeleteAssignedTasks}
          style={[styles.btnUsuario, { backgroundColor: "#cb3234" }]}
        >
          <Text style={styles.txtUser}>Eliminar tareas asignadas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={AreYouSureLogOut}
          style={[styles.btnUsuario, { backgroundColor: "#111" }]}
        >
          <Text style={styles.txtUser}>Cerrar sesión</Text>

            </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
