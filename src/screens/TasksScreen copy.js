import React, { memo, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, SafeAreaView, View, Image, Alert, TouchableOpacity, Button, SectionList, Pressable, ScrollView } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, writeBatch, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot, setDoc,
doc, where, serverTimestamp, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import { MultiSelect } from "react-native-element-dropdown";

export default function TasksScreen({ navigate, route }) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  //datepicker
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [task_frec, setTask_frec] = useState(1);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selected, setSelected] = useState([]);
  const [taskSelected, setTaskSelected] = useState([]);
  const [taskAvaiable, setTaskAvaiable] = useState([]);

  const batch = writeBatch(db);

  //efect on update checklist
  const onUpdateCheck = useRef(true);
  const [cond, setCond] = useState(false);
  
  const [checkList, setCheckList] = useState([]);
  const [firstTask, setFirstTask] = useState('');

  
  const [markAll, setMarkAll] = useState(false);

  const [checked, setChecked] = useState("unchecked");

  const DeleteImg = memo(() => (
    <Image
          style={{ width: 25, height: 25 }}
          source={require("../assets/tachoBasura.png")}
    />
  )
);

  let contador = -1;

  const verChecklist = () => {
    checkList.forEach((element, i) => {
      console.log("tarea: " + i + ": " + element);
    });
  };
  const verTaskSelected = () => {
    let id = [];
    console.log("paso n veces");
    tasks.forEach((element) => {
      console.log("paso b veces");

      id = element.id;
      id.forEach((d) => {
        console.log("id: " + d);
      });
    });
  };

  const setAllChecked = () => {
    let c = checkList;
    console.log('marcar todas');
      if (!markAll){
        c.forEach((task, i) => {
          c[i] = 'checked';
        });
        setMarkAll(true)
      }else{
        c.forEach((task, i) => {
          c[i] = 'unchecked';
        });
        setMarkAll(false)
      }
    setCheckList(c)
  }
  
  const ejecuteQuery = (item) => {
    let collectionRef = collection(db, "tasks");
    let unsuscribe;
    let TaskQuery = [];
    let tasksAndSector = [];
    let nid = 0;

    if (item) {
      item.forEach((element) => {
        let q = query(collectionRef, where("task_sector", "==", element));
        unsuscribe = onSnapshot(q, (querySnapshot) => {
          console.log('ejectuta on snap');
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

            let firstTask = tasksAndSector[0]
            firstTask = firstTask.data
            firstTask = firstTask[0]
            console.log("tasksAndSector");
            console.log(tasksAndSector);
            setTaskAvaiable(tasksAndSector);
            setFirstTask(firstTask)
          }
        });
      });
    } else {
      console.log("se setea vacio");
      setTasks([]);
    }

    return unsuscribe;
  };

  const renderItem = ({ item }) => {
    if (selected) {
      console.log("selected: " + selected);

      console.log("item renderItem: " + item.title);
      return <Item title={item.title} />;
    } else {
      setTasks([]);
    }
  };
  
  const Item = ({ title }) => (
    <View style={styles.itemSectionlist}>
      <Text style={styles.titleSectionlist}>{title}</Text>
    </View>
  );

  
  const cleanTasks = () => {
    setFirstTask('')
    contador=-1;
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
    console.log('llego aca');

    deleteDoc(doc(db, "tasks", task.id)).then(() => {
      Alert.alert('Se elimino la tarea '+ task.taskName+' con exito')
    });
  }

  
  const getIndexTask = (task) => {

    let pos = 0
    let findIndex = false
    let updateTasks = tasks
    while (!findIndex) {
      for (let i = 0; i < updateTasks.length; i++) {
        let sector = updateTasks[i];
        let data = sector.data
        for (let j = 0; j < data.length; j++) {
          let taskOriginal = data[j]
          if (task.taskName == taskOriginal.taskName){
            findIndex = true
            taskOriginal.defaultAssigned = !taskOriginal.defaultAssigned
            break
          }
          pos++
        }
        if (findIndex) break
      }
    }
    setTasks([updateTasks])
  }

  const changeDefault = async (task) => {
    const ref = doc(db, "tasks", task.taskName);
    await updateDoc(ref, {default_assigned: !task.defaultAssigned})
    getIndexTask(task)
  }

  const renderSectionList = ({ item }) => {
    contador++;
    if (firstTask == item.taskName){
      contador = 0;
    }
    let checkIndex = 0;
    //  si no hay checklist, la setea unchecked
    if (checkList.length == 0) {
      tasks.forEach((s) => {
        s.data.forEach((task) => {
          checkList[checkIndex] = "unchecked";
          checkIndex++;
        });
      });
    }
    let i = contador;
    console.log("se renderiza con item " + item.taskName + " index: " + i);
    let defaultAssigned = item.defaultAssigned
    return (
      <View style={[styles.viewSeccion, {backgroundColor: !defaultAssigned ? "#cecece" : ""}]}>
        <View>
          <Item title={item.taskName} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <View>
            {defaultAssigned && <TouchableOpacity onPress={() => changeDefault(item)}><Text style={styles.pActive}>desactivar</Text></TouchableOpacity>}
            {!defaultAssigned && <TouchableOpacity onPress={() => changeDefault(item)}><Text style={styles.pActive}>activar</Text></TouchableOpacity>}
          </View>
          <TouchableOpacity onPress={() => areYouSureDeleteTask(item.taskName)}>
            <DeleteImg />
          </TouchableOpacity>
          <View style={{marginRight: 5}} />
        </View>
      </View>
    );
  };
  const handleCheck = (i) => {
    let check = checkList;
    if (check.length > 0) {
      if (check[i] == "unchecked") {
        check[i] = "checked";
      } else {
        check[i] = "unchecked";
      }
    }
    setCheckList(check);
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


  const getAllTasks = async () => {
    const q = query(collection(db, "tasks"), where("task_name", "!=", null));
    let tasks = []
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      tasks.push(doc.data())
    });
    return tasks
  }
  

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
  const TaskView = ({ task }) => {
    let taskName = task.taskName
    let defaultAssigned = task.defaultAssigned

    return(
        <View style={[styles.viewSeccion, {backgroundColor: !defaultAssigned ? "#cecece" : ""}]}>
          <View style={[styles.itemSectionlist, {width:"60%"}]}>
            <Text style={styles.titleSectionlist}>{taskName}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", position: "absolute", right: 10}}>
            {defaultAssigned && <TouchableOpacity onPress={() => changeDefault(task)}><Text style={styles.pActive}>desactivar</Text></TouchableOpacity>}
            {!defaultAssigned && <TouchableOpacity onPress={() => changeDefault(task)}><Text style={styles.pActive}>activar</Text></TouchableOpacity>}
            <View>
              <TouchableOpacity onPress={() => areYouSureDeleteTask(task)}>
                <DeleteImg />
              </TouchableOpacity>
            </View>
          </View>
        </View>
    )
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
        placeholder="En el sector"
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
      <View style={{ width: 200, marginTop: 15 }}>
        <Button
          title="Ver tareas disponibles"
          color="#B0C4DE"
          onPress={() => {
            setTasks(taskAvaiable);
          }}
        />
      </View>
      <View style={{ marginTop: 15 }} />

      <ScrollView>
          {tasks.map((sector, i) => {
            let data = sector.data

            return(
              <View>
                <Text style={styles.SectionHeader}>{sector.title}</Text>
                <ListTasks key={i} data={data} />
              </View>
              )
            })
        }
      </ScrollView>

      {/* <SectionList
        style={{ height: "34%", maxWidth: "95%" }}
        sections={tasks}
        renderItem={renderSectionList}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.SectionHeader}>{title}</Text>
        )}
      /> */}
      
      {/* <Pressable onPress={putAllTasksDefaultActive}>
        <Text>actualizar</Text>
      </Pressable> */}
    
    </SafeAreaView>
  );
}
