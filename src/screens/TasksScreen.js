import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, View, Image, Alert, TouchableOpacity, Button, Pressable, ScrollView } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, writeBatch, collection, query, getDocs, orderBy, onSnapshot, doc, where } from "firebase/firestore";

import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import { MultiSelect } from "react-native-element-dropdown";
import TaskView from './components/TaskView'
import { TaskSearchInput } from "./components/TaskSearchInput";
import { getAllTasks, getTaskBySearch } from "../services/tasksServices";
export default function TasksScreen({ navigate, route }) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  //datepicker
  const [sectors, setSectors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [taskSelected, setTaskSelected] = useState([]);
  const [taskAvaiable, setTaskAvaiable] = useState([]);
  const [checkList, setCheckList] = useState([]);
  
  const batch = writeBatch(db);
  
  const ejecuteQuery = (item) => {
    console.log('HACE QUERY');
    console.log('HACE QUERY');
    console.log('HACE QUERY');
    let collectionRef = collection(db, "tasks");
    let TaskQuery = [];
    let tasksAndSector = [];
    if (item) {
      item.forEach(async (element) => {
        let q = query(collectionRef, where("task_sector", "==", element));
        const querySnapshot = await getDocs(q);
          TaskQuery = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            taskName: doc.data().task_name,
            defaultAssigned: doc.data().default_assigned,
          }));
          if (TaskQuery == "") {
            console.log("taskquery vacio");
          } else {

            let Tasks = [];
            TaskQuery.forEach((task) => {
              let objTask = {}
              objTask.taskName = task.taskName;
              objTask.defaultAssigned = task.defaultAssigned;
              objTask.id = task.id;
              Tasks.push(objTask);
            });
            
            let singleObj = {};
            singleObj["title"] = element;
            singleObj["data"] = Tasks;
            tasksAndSector.push(singleObj);
            setTaskAvaiable(tasksAndSector);
          }
      });
    } else {
      console.log("se setea vacio");
      setTasks([]);
    }
  };
  
  const cleanTasks = () => {
    setCheckList([])
    setTaskAvaiable([])
    setTasks([])
  }

  const addTaskSelected = (item) => {
    let arregloTasks = [];
    if (item) {
      item.forEach((sector) => {
        let singleObj = {};
        singleObj["title"] = sector;
        singleObj["id"] = sector;
        arregloTasks.push(singleObj);
      });
      setTaskSelected(arregloTasks);
    }
  };

  const _renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        <Image style={styles.icon} />
      </View>
    );
  };

  

  
  

  


  useEffect(() => {
    console.log("entro assignTaskScreen");
    let collectionRef = collection(db, "sectors");
    let q = query(collectionRef, orderBy("sector_name", "desc"));

    let unsuscribe = onSnapshot(q, (querySnapshot) => {
      let sectors = [];

      sectors = querySnapshot.docs.map((doc) => ({
        sector_name: doc.data().sector_name,
        sector_description: doc.data().sector_description,
      }));

      let arregloSectores = [];
      if (sectors) {
        sectors.forEach((sector) => {
          let singleObj = {};
          singleObj["label"] = sector.sector_name;
          singleObj["value"] = sector.sector_name;
          arregloSectores.push(singleObj);
        });
        setSectors(arregloSectores);
      } else console.log("No hay sectores");
    });

    return unsuscribe;
  }, []);

  const commitBatch = async () => {
    await batch.commit().then(() => {
      Alert.alert('Change successfully!')
    })
  }


  const putAllTasksDefaultActive = async () => {
      let allTasks = await getAllTasks();
      console.log(allTasks);
      console.log(allTasks.length);
      
      allTasks.forEach((task) => {
          let ref = doc(db, "tasks", task.task_name);
          batch.update(ref, { default_assigned: true });
      });
      commitBatch();

  }

  const ListTasks = ( {data} ) => {
    
    return (
      <View>
        {data && (
          data.map((task) => (<TaskView key={task.id} task={task}/>))
        )}
      </View>
    )
  }


  const formatTasks = (filteredTasks) => {

    console.log('formatt');
    let objSectorWithTasks = {}
    filteredTasks.forEach((task) => {
      let objTask = {}
      objTask.taskName = task.task_name;
      objTask.defaultAssigned = task.default_assigned;
      objTask.id = task.id;

      if(!objSectorWithTasks[task.task_sector]) {
        objSectorWithTasks[task.task_sector] = []
      }
      objSectorWithTasks[task.task_sector].push(objTask)
    });
    
    let Tasks = []
    for (const sector in objSectorWithTasks) {
      if (Object.hasOwnProperty.call(objSectorWithTasks, sector)) {
        const data = objSectorWithTasks[sector];
        let newObj = {}
        newObj.title = sector
        newObj.data = data
        Tasks.push(newObj)
      }
    }
    return Tasks
  }

  const handleSubmit = async (search) => {
    if(!taskAvaiable) return
    if(!search){
      setTasks(taskAvaiable)
      return
    }
    if(search && taskAvaiable.length == 0){
      let filteredTasks = await getTaskBySearch(search)
      const formatedTasks = formatTasks(filteredTasks)
      setTasks(formatedTasks)
      return
    }
    let newTaskAvaiable = taskAvaiable
    newTaskAvaiable.forEach(sector => {
      sector.data = sector.data.filter(task => task.taskName.toLowerCase().includes(search.toLowerCase()))
    });
    
    newTaskAvaiable.forEach(sector => {
      console.log(newTaskAvaiable);
    });
    if(!newTaskAvaiable) console.log('vacio');
    setTasks(newTaskAvaiable)
  }

  const SubmitComp = () => {
    const [search, getSearch] = useState(null);
    
    return(
      <>
        <View style={{ marginTop:15 }}>
          <TaskSearchInput getSearch={getSearch} />
        </View>
          {(tasks.length == 0) && (
            <View style={{ width: 200, marginTop: 15 }}>
            <Button
              title="Ver tareas disponibles"
              color="#B0C4DE"
              onPress={() => {
                handleSubmit(search)
              }}
            />
        </View>
        )}
      </>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      
      <MultiSelect
        renderLeftIcon={() => <Image style={styles.icon} />}
        containerStyle={styles.shadow}
        style={styles.dropdown}
        data={sectors}
        labelField="label"
        valueField="value"
        label="Multi Select"
        placeholder="Todos los sectores"
        search
        searchPlaceholder="Buscar sector"
        value={selected}
        onChange={(item) => {
          cleanTasks();
          addTaskSelected(item);
          setSelected(item);
          ejecuteQuery(item);
        }}
        renderItem={(item) => _renderItem(item)}
      />
      <SubmitComp />
      
      <View style={{ marginTop: 15 }} />

      <ScrollView>
          {tasks.map((sector, i) => {
            let data = sector.data

            return(
              <View>
                <Text style={styles.SectionHeader}>{sector.title}</Text>
                <ListTasks key={sector.title} data={data} />
              </View>
              )
            })
        }
      </ScrollView>
    </SafeAreaView>
  );
}
