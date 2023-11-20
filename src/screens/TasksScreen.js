import React, { memo, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, SafeAreaView, View, Image, Alert, TouchableOpacity, Button, SectionList } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot, setDoc,
doc, where, serverTimestamp, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import { MultiSelect } from "react-native-element-dropdown";
import { Checkbox } from "react-native-paper";
import DatePicker from "react-native-date-picker";

export default function TasksScreen({ navigate, route }) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  //datepicker
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [task_name, setTask_name] = useState([]);
  const [task_frec, setTask_frec] = useState(1);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selected, setSelected] = useState([]);
  const [taskSelected, setTaskSelected] = useState([]);
  const [taskAvaiable, setTaskAvaiable] = useState([]);

  //efect on update checklist
  const onUpdateCheck = useRef(true);

  const [checkList, setCheckList] = useState([]);
  const [firstTask, setFirstTask] = useState('');

  
  const [markAll, setMarkAll] = useState(false);

  const [checked, setChecked] = useState("unchecked");

  const EditImg = memo(() => (
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
    task_name.forEach((element) => {
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
          TaskQuery = querySnapshot.docs.map((doc) => ({
            key: doc.data().task_name,
          }));
          if (TaskQuery == "") {
            console.log("taskquery vacio");
          } else {
            let Tasks = [];
            let id = [];

            TaskQuery.forEach((task) => {
              let a;
              a = task.key;
              id.push(nid);
              Tasks.push(a);
              nid++;
              console.log("id each: " + nid);
            });

            let singleObj = {};
            singleObj["title"] = element;
            singleObj["data"] = Tasks;
            singleObj["id"] = id;

            tasksAndSector.push(singleObj);

            let firstTask = tasksAndSector[0]
            firstTask = firstTask.data
            firstTask = firstTask[0]
            setTaskAvaiable(tasksAndSector);
            setFirstTask(firstTask)
          }
        });
      });
    } else {
      console.log("se setea vacio");
      setTask_name([]);
    }

    return unsuscribe;
  };

  const renderItem = ({ item }) => {
    if (selected) {
      console.log("selected: " + selected);

      console.log("item renderItem: " + item.title);
      return <Item title={item.title} />;
    } else {
      setTask_name([]);
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
    setTask_name([])
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

  const areYouSureDeleteTask = (item) => {
    console.log('aresure');
      return Alert.alert("Vas a eliminar la tarea "+item, "Estas seguro?", [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },    
        { text: "OK", onPress: () => deleteTask(item) },
      ]);
  }
  
  const deleteTask = async (item) =>{
    console.log('llego aca');

    deleteDoc(doc(db, "tasks", item)).then(() => {
      Alert.alert('Se elimino la tarea '+ item+' con exito')
    });
  }



  const handleCreateTask = async () => {
    if (!task_name) {
      Alert.alert("No hay tareas en ese sector");
    } else if (selectedUser == null) {
      Alert.alert("No hay usuario seleccionado");
    } else {
      let cantChecks = 0;
      checkList.forEach((element) => {
        if (element == "unchecked") {
          cantChecks++;
        }
      });
      if (cantChecks == checkList.length) {
        Alert.alert("Por lo menos hay que asignar 1 tarea");
      } else {
        //Add AssignTask
        let search = 0;
        let assigned_tasks = [];

        task_name.forEach((s) => {
          let objAssigned_tasks = {};
          let addData = [];
          let data = s.data;
          let title = s.title;
          data.forEach((task) => {
            if (checkList[search] == "checked") {
              addData.push(task);
            }
            search++;
          });
          objAssigned_tasks.data = addData;
          objAssigned_tasks.sector = title;
          assigned_tasks.push(objAssigned_tasks);
        });

        let marked = [];
        let checkIndex = 0;

        assigned_tasks.forEach((s) => {
          s.data.forEach((task) => {
            marked[checkIndex] = "unchecked";
            checkIndex++;
          });
        });
        checkIndex = 0;

        // check if already exist assigned task for selectedUser

        const docRef = doc(db, "assigned_tasks", selectedUser);
        const docSnap = await getDoc(docRef);

        // if exist update
        if (docSnap.exists()) {
          await updateDoc(doc(db, "assigned_tasks", selectedUser), {
            active_tasks: assigned_tasks,
            marked_tasks: marked,
            control_marked_tasks: marked,
            timestamp: serverTimestamp(),
            uid: selectedUser,
            time_limit: date,
          }).then(Alert.alert("Tareas asignadas"));
        } else {
          await setDoc(doc(db, "assigned_tasks", selectedUser), {
            active_tasks: assigned_tasks,
            marked_tasks: marked,
            control_marked_tasks: marked,
            timestamp: serverTimestamp(),
            uid: selectedUser,
            time_limit: date,
          }).then(Alert.alert("Tareas asignadas"));
        }
      }
    }
  };

  const renderSectionList = ({ item }) => {
    contador++;
    if (firstTask == item){
      contador = 0;
    }
    let checkIndex = 0;
    //  si no hay checklist, la setea unchecked
    if (checkList.length == 0) {
      task_name.forEach((s) => {
        s.data.forEach((task) => {
          checkList[checkIndex] = "unchecked";
          checkIndex++;
        });
      });
    }
    let i = contador;
    console.log("se renderiza con item " + item + " index: " + i);

    return (
      <View style={styles.viewSeccion}>
        <View>
          <Item title={item} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity onPress={() => areYouSureDeleteTask(item)}>
            <EditImg />
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

    collectionRef = collection(db, "user");
    q = query(collectionRef, orderBy("username", "asc"));

    return unsuscribe;
  }, []);

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
            setTask_name(taskAvaiable);
          }}
        />
      </View>

      <View style={{ marginTop: 15 }} />

      <SectionList
        style={{ height: "34%" }}
        sections={task_name}
        renderItem={renderSectionList}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.SectionHeader}>{title}</Text>
        )}
      />
    
    </SafeAreaView>
  );
}
