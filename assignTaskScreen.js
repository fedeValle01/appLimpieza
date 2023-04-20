import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, SafeAreaView, View, Image, Alert, TouchableOpacity, Button, SectionList } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot, setDoc, doc, where, serverTimestamp,
 updateDoc, getDoc } from "firebase/firestore";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { Checkbox } from "react-native-paper";
import DatePicker from "react-native-date-picker";

export default function AssignTaskScreen({ navigate, route }) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  //datepicker
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
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
  
  const [markAll, setMarkAll] = useState(false);

  const [checked, setChecked] = useState("unchecked");

  const DATA = [
    {
      title: "Main dishes",
      data: ["Pizza", "Burger", "Risotto"],
    },
    {
      title: "Sides",
      data: ["French Fries", "Onion Rings", "Fried Shrimps"],
    },
    {
      title: "Drinks",
      data: ["Water", "Coke", "Beer"],
    },
    {
      title: "Desserts",
      data: ["Cheese Cake", "Ice Cream"],
    },
  ];

  const [data2, setdata2n] = useState([
    { key: "1" },
    { key: "2" },
    { key: "3" },
    { key: "4" },
  ]);

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

            setTaskAvaiable(tasksAndSector);

            console.log("paso una vez por aca");
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
const BtnSelectAll = () => {
  if (task_name.length > 0) {
  return(
    <View style={{ width: 200, marginTop: 15 }}>
      <Button onPress={setAllChecked}
        title='Seleccionar todas'
        color='#E3682C'
        >
      </Button>
    </View>
  )
}
}
  const SelectDate = () => {
    if (task_name.length > 0) {
      return (
        <View style={{ width: 200, marginTop: 15 }}>
          <Button title="Plazo hasta" onPress={() => setOpen(true)} />
          <DatePicker
            title={"Seleccionar fecha"}
            confirmText={"Confirmar"}
            cancelText={"Cancelar"}
            modal
            open={open}
            date={date}
            onConfirm={(date) => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
      );
    }
  };
  const AssignTaskButton = () => {
    if (task_name.length > 0) {
      return (
        <View style={{ width: 200, marginTop: 15 }}>
          <Button
            title="Asignar Tareas"
            color="#43c6ac"
            onPress={handleCreateTask}
          />
        </View>
      );
    }
  };

  const Item = ({ title }) => (
    <View style={styles.itemSectionlist}>
      <Text style={styles.titleSectionlist}>{title}</Text>
    </View>
  );

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
    if (contador >= checkList.length) {
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
        <View style={{ flex: 1 }} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text>{i}</Text>

          <Checkbox
            status={checkList[i]}
            onPress={() => {
              handleCheck(i);
              if (checked == "unchecked") {
                setChecked("checked");
              } else {
                setChecked("unchecked");
              }
            }}
          />
        </View>
      </View>
    );
  };
  const renderChecklist = ({ item }) => {
    console.log("se renderiza con item: " + item.key);
    let task = item.key;

    let j = 0;
    //  si no hay checklist, la setea unchecked
    if (checkList.length == 0) {
      for (j = 0; j < task_name.length; j++) {
        console.log("i: " + i);
        checkList[j] = "unchecked";
      }
    }

    console.log("tarea: " + task + " en la posicion: " + i);
    return (
      <View style={styles.row}>
        <View>
          <Text style={styles.item}>{task}</Text>
        </View>
        <View style={{ flex: 1 }} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Checkbox
            status={checkList[i]}
            onPress={() => {
              handleCheck(i);
            }}
          />
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
    //-----------Notifications------------------
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "Ultimo dia para limpiar!",
    //     body: "Tenes tareas en: cocina, patio externo",
    //   },
    //   trigger: {
    //     seconds: 10,
    //   },
    // });

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

    unsuscribe = onSnapshot(q, (querySnapshot) => {
      let users = [];
      users = querySnapshot.docs.map((doc) => ({
        label: doc.data().username,
        value: doc.data().username,
        uid: doc.data().uid,
      }));
      setUser(users);

      if (onUpdateCheck.current) {
        onUpdateCheck.current = false;
      } else {
        console.log("updateCheck");
      }
    });
    return unsuscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.shadow}
        data={user}
        search
        searchPlaceholder="Buscar usuario"
        labelField="label"
        valueField="value"
        label="User"
        placeholder="Al usuario"
        value={selectedUser}
        onChange={(item) => {
          setSelectedUser(item.uid);
        }}
        renderLeftIcon={() => <Image style={styles.icon} />}
        renderItem={(item) => _renderItem(item)}
        textError="Error"
      />

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
        <BtnSelectAll/>
        
      <View style={{ flex: 1 }}>

        {/* doesn't work on android emulator */}
        
        <SelectDate />
          
        <AssignTaskButton />
      </View>
    </SafeAreaView>
  );
}
