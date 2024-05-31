import React, { memo, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, SafeAreaView, View, Image, Alert, TouchableOpacity, Button, SectionList, ScrollView, Pressable, Modal, Dimensions } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot, setDoc, doc, where, serverTimestamp,
 updateDoc, getDoc } from "firebase/firestore";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";


import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { Checkbox } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getSectors } from "../helpers/getSectors";
import { getUsersUID } from "../helpers/getUsersUID";
import { getUserList } from "../helpers/getUserList";
import { BlurView } from "expo-blur";
import styleModal from "./styleModal";
import { formatDate } from "../helpers/formatDate";
import stylesStock from "./stock/stylesStock";
export default function AssignTaskScreen({ navigate, route }) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  //datepicker
  const [sectors, setSectors] = useState([]);
  const [task_name, setTask_name] = useState([]);
  const [task_frec, setTask_frec] = useState(1);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [nameSelected, setNameSelected] = useState(null);

  
  const [selected, setSelected] = useState([]);
  const [taskSelected, setTaskSelected] = useState([]);
  const [taskAvaiable, setTaskAvaiable] = useState([]);

  //efect on update checklist
  const onUpdateCheck = useRef(true);

  
  const [firstTask, setFirstTask] = useState('');
  const [checkList, setCheckList] = useState([]);
  const [markAll, setMarkAll] = useState(false);
  const [checked, setChecked] = useState("unchecked");

  const { width, height } = Dimensions.get('window');

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

    console.log('ejquery');
    let collectionRef = collection(db, "groups", route.params.groupCode, "tasks");
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

  const CheckImg = memo(() => (
    <Image
      style={{ width: 25, height: 25 }}
      source={require("../assets/check.png")}
    />
  ));

  const SelectDateImg = memo(() => (
    <Image
      style={{ width: 25, height: 25 }}
      source={require("../assets/clock.png")}
    />
  ));

  
const BtnSelectAll = () => {
  if (task_name.length > 0) {
  return(
    <View style={{ width: 25, height: 25, opacity: 0.8 }}>
      <TouchableOpacity onPress={setAllChecked}>
        <CheckImg />
      </TouchableOpacity>
    </View>
  )
}
}
  const SelectDate = ( {setShowDatePicker, date, setDate}) => {

    const [newDate, setNewDate] = useState(date);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShow(false);
      setNewDate(currentDate);
      setDate(currentDate);
    };
  
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
  
    const showDatepicker = () => {
      showMode('date');
    };
  
    const showTimepicker = () => {
      showMode('time');
    };

    const formattedDate = formatDate(newDate)

      return (
        
          <BlurView tint="dark" intensity={80}  style={{backgroundColor: "#0f0", justifyContent: "center", alignContent: "center", width: width, height: height}}>
            <View style={styleModal.modalView}>
              <View style={{marginBottom: 20}}>
                <Button onPress={showDatepicker} title="Seleccionar Fecha" />
              </View>
              <View style={{marginBottom: 20}}>
                <Button onPress={showTimepicker} title="Seleccionar Hora" />
              </View>
              <Text style={{fontSize: 17, fontWeight: "600", color: "#fff" }}>Fecha Limite: {formattedDate}</Text>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={newDate}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChange}
                />
              )}

              <TouchableOpacity
                style={[stylesStock.button, stylesStock.buttonClose, { marginTop: 10, backgroundColor: '#31a84f' }]}
                onPress={()=> setShowDatePicker(false)}>
                <Text style={stylesStock.textStyle}>Aceptar</Text>
              </TouchableOpacity>
            </View>

          </BlurView>
          
      );
  };


  

  const ModalDateTimePicker = ( {showDatePicker, setShowDatePicker, date, setDate} ) => {

    return(
      <>
        <Modal
            animationType="fade"
            transparent={true}
            visible={showDatePicker}
            onRequestClose={() => {
                setShowDatePicker(false)
        }}>
            <SelectDate setShowDatePicker={setShowDatePicker} date={date} setDate={setDate} />
        </Modal>
      </>
    )
  }

  const AssignSection = () => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    console.log('render AssignSection');
    if (task_name.length>0) return(
      <>
        {(showDatePicker) && <ModalDateTimePicker showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} date={date} setDate={setDate} />}

        <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", position: "absolute", bottom: 20 }}>

          <View style={{ alignSelf: "center", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
  
          <AssignTaskButton date={date} />
          
          <View style={{marginHorizontal: 5}}>
            <Button
              title="Plazo"
              color="#B0C4DE"
              onPress={() => {setShowDatePicker(true)}}
            />
          </View>

          <BtnSelectAll/>
          
          </View>

          

        </View>
      </>

    )
  }
  const AssignTaskButton = ( {date} ) => {
    if (task_name.length > 0) {
      return (
        <View style={{ width: 160, opacity: 0.8 }}>
          <Button
            title="Asignar Tareas"
            color="#43c6ac"
            onPress={() => handleCreateTask(date)}
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

  const cleanTasks = () => {
    setFirstTask('')
    contador=-1;
    setCheckList([])
    setTaskAvaiable([])
    setTask_name([])
  }

  const _renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        <Image style={styles.icon} />
      </View>
    );
  };

  const handleCreateTask = async (date) => {
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
        console.log("date");
        console.log(date);
        const docRef = doc(db, "groups", route.params.groupCode, "assigned_tasks", selectedUser);
        const docSnap = await getDoc(docRef);

        // if exist update
        if (docSnap.exists()) {
          await updateDoc(doc(db, "groups", route.params.groupCode, "assigned_tasks", selectedUser), {
            active_tasks: assigned_tasks,
            marked_tasks: marked,
            control_marked_tasks: marked,
            timestamp: serverTimestamp(),
            uid: selectedUser,
            time_limit: date,
          }).then(Alert.alert("Tareas asignadas"));
        } else {
          await setDoc(doc(db, "groups", route.params.groupCode, "assigned_tasks", selectedUser), {
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
    if (firstTask == item){ // sincroniza index con la primera tarea
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

      
    const getUsersAndSector = async () => {
      const sectors = await getSectors(route.params.groupCode)
      const usersUID = await getUsersUID(route.params.groupCode)
      const usersList = await getUserList(usersUID)

      let users = []
      for (const user of usersList) {
        let objUser = {}
        objUser.uid = user.uid
        objUser.label = user.username
        objUser.value = user.username
        users.push(objUser)
      }

      let formatedSectors = []
      for (const sector of sectors) {
        let objSector = {}
        objSector.label = sector.sector_name
        objSector.value = sector.sector_name
        formatedSectors.push(objSector)
      }
      
      setUsers(users);
      setSectors(formatedSectors)

    }
    getUsersAndSector()
    
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.shadow}
        data={users}
        search
        searchPlaceholder="Buscar usuario"
        labelField="label"
        valueField="value"
        label="User"
        placeholder="Al usuario"
        value={nameSelected}
        onChange={(item) => {
          setSelectedUser(item.uid);
          setNameSelected(item.value)
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
          cleanTasks();
          setSelected(item)
          addTaskSelected(item);
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
      <ScrollView style={{ height: "40%" }}>
        <SectionList
          style={{ height: "34%" }}
          sections={task_name}
          renderItem={renderSectionList}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.SectionHeader}>{title}</Text>
          )}
        />
      </ScrollView>

      
      <AssignSection />
      
    </SafeAreaView>
  );
}
