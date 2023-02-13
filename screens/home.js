import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  SectionList,
  Image,
} from "react-native";
import {
  doc,
  setDoc,
  getFirestore,
  collection,
  orderBy,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import { Checkbox } from "react-native-paper";

console.log("setea contador -1");
let contador = -1;

export default function HomeScreen({ navigation, route }) {
  console.log("render HomeScreen");
  contador = -1;
  const auth = getAuth(app);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [sectors, setSectors] = useState([]);
  const [user, setUser] = useState([]);
  const [taskUser, setTaskUser] = useState([]);

  //can mark check controlCheckList
  const [canControl, setCanControl] = useState(false);

  const [activeTasks, setActiveTasks] = useState([]);
  const [markedTasks, setMarkedTasks] = useState([]);
  const [checkList, setCheckList] = useState([]);
  const [controlCheckList, setControlCheckList] = useState([]);
  const [canCheckTask, setCanCheckTask] = useState(false);

  const [checked, setChecked] = useState([]);

  const DATA = [
    //data example sectionList
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

  const irACrearSector = () => {
    if (route.params.uid == "UDUaYCyuVJYCTP7Y21DJ7ylD8aO2") {
      console.log("Es Fedev");
      navigation.navigate("AddSector", { uid: route.params.uid });
    } else alert("solo admin");
  };

  const logActiveTasks = () => {
    activeTasks.forEach((element) => {
      let active_tasks = element.active_tasks;
      active_tasks.forEach((task) => {
        console.log("sector: " + task.sector);
        task.data.forEach((task) => {
          console.log("tarea: " + task);
        });
      });
    });
  };

  const handleControlCheck = async (i) => {
    let check = controlCheckList;
    if (check.length > 0) {
      if (check[i] == "unchecked") {
        check[i] = "checked";
      } else {
        check[i] = "unchecked";
      }
    }
    setControlCheckList(check);

    //Add markedTask
    await updateDoc(doc(db, "assigned_tasks", route.params.uidTask), {
      control_marked_tasks: check,
      timestamp_control_marked_tasks: serverTimestamp(),
    });
  };

  const handleCheck = async (i) => {
    let check = checkList;
    if (check.length > 0) {
      if (check[i] == "unchecked") {
        check[i] = "checked";
      } else {
        check[i] = "unchecked";
      }
    }
    setCheckList(check);

    //Add markedTask
    await updateDoc(doc(db, "assigned_tasks", route.params.uidTask), {
      marked_tasks: check,
      timestamp_marked_task: serverTimestamp(),
    });
  };
  const renderAssignedTasks = ({ item }) => {
    contador++;
    if (contador >= checkList.length) {
      console.log("contador: " + contador + ">= ntareas: " + checkList.length);
      contador = 0;
    }
    let checkIndex = 0;

    //  si no hay checklist, la setea unchecked
    if (checkList.length == 0) {
      console.log("check vacio, set unchecked");
      activeTasks.forEach((s) => {
        s.data.forEach((task) => {
          checkList[checkIndex] = "unchecked";
          checkIndex++;
        });
      });
      checkIndex = 0;
    }
    if (controlCheckList.length == 0) {
      console.log("controlCheckList vacio, set unchecked");
      activeTasks.forEach((s) => {
        s.data.forEach((task) => {
          controlCheckList[checkIndex] = "unchecked";
          checkIndex++;
        });
      });
    }
    let i = contador;
    // console.log("render: " + item + " index: " + i);

    return (
      <View style={styles.viewSeccion}>
        <View>
          <Item title={item} />
        </View>
        <View style={{ flex: 1 }} />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>{i + 1}</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View>
              {/* user checkbox */}
              <Checkbox
                disabled={!canCheckTask}
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
            <View>
              {/* control checkbox */}
              <Checkbox
                color="#39ff14"
                status={controlCheckList[i]}
                disabled={!canControl}
                onPress={() => {
                  handleControlCheck(i);
                  if (checked == "unchecked") {
                    setChecked("checked");
                  } else {
                    setChecked("unchecked");
                  }
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const AreYouSureAlert = () => {
    return Alert.alert("Va a cerrar sesion", "Esta seguro?", [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: logOut },
    ]);
  };
  const logOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Iniciar Sesion");
      })
      .catch((error) => {
        alert(error);
      });
  };

  function CasaImg() {
    return (
      <Image
        style={{ width: 200, height: 200 }}
        source={require("../assets/casaLaCosta.png")}
      />
    );
  }
  function HistorialImg() {
    return (
      <Image
        style={{ width: 45, height: 45 }}
        source={require("../assets/historial.png")}
      />
    );
  }

  function LogOutImg() {
    return (
      <Image
        style={{ width: 38, height: 38 }}
        source={require("../assets/cerrar-sesion.png")}
      />
    );
  }

  function AgregarTareaImg() {
    return (
      <Image
        style={{ width: 50, height: 50 }}
        source={require("../assets/agregarTarea.png")}
      />
    );
  }

  function LogoTitle() {
    return (
      <Image
        style={{ width: 50, height: 50 }}
        source={require("../assets/logo.png")}
      />
    );
  }

  function HomeImg() {
    return (
      <Image
        style={{ width: 45, height: 45 }}
        source={require("../assets/home.png")}
      />
    );
  }

  function UsersImg() {
    return (
      <Image
        style={{ width: 40, height: 40 }}
        source={require("../assets/usuarios.png")}
      />
    );
  }

  function AsigImg() {
    return (
      <Image
        style={{
          width: 40,
          height: 40,
        }}
        source={require("../assets/asig.png")}
      />
    );
  }

  const Item = ({ title }) => (
    <View style={styles.itemSectionlist}>
      <Text style={styles.titleSectionlist}>{title}</Text>
    </View>
  );

  useEffect(
    () => {
      //-----------NAVBAR------------------
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Usuarios", { uid: route.params.uid })
              }
            >
              <View>
                <UsersImg />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Agregar Tarea", { uid: route.params.uid })
              }
            >
              <View style={{ alignContent: "center" }}>
                <AgregarTareaImg />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Asignar Tareas", { uid: route.params.uid })
              }
            >
              <View>
                <AsigImg />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={AreYouSureAlert}>
              <View style={{ marginLeft: 10 }}>
                <LogOutImg />
              </View>
            </TouchableOpacity>
          </View>
        ),
        headerLeft: () => <View></View>,
      });
      //-----------NAVBAR------------------

      if (route.params.uid == route.params.uidTask) {
        //Es el usuario viendo sus tareas
        setCanCheckTask(true);
      } else {
        setCanCheckTask(false);
      }
      let q;
      let unsuscribe;
      let collectionRef = collection(db, "sectors");
      q = query(collectionRef, orderBy("sector_name", "asc"));

      unsuscribe = onSnapshot(q, (querySnapshot) => {
        setSectors(
          querySnapshot.docs.map((doc) => ({
            key: doc.data().sector_name,
            sector_description: doc.data().sector_description,
          }))
        );
      });

      let u;
      collectionRef = collection(db, "user");
      q = query(collectionRef, where("uid", "==", route.params.uid));
      unsuscribe = onSnapshot(q, (querySnapshot) => {
        u = querySnapshot.docs.map((doc) => ({
          name: doc.data().username,
          canControl: doc.data().can_control,
        }));

        u.forEach((element) => {
          console.log("u: " + element.name); //username active session
          setUser(element.name);
          setCanControl(element.canControl);
        });
      });

      collectionRef = collection(db, "user");
      q = query(collectionRef, where("uid", "==", route.params.uidTask));
      unsuscribe = onSnapshot(q, (querySnapshot) => {
        u = querySnapshot.docs.map((doc) => ({
          name: doc.data().username,
        }));

        u.forEach((element) => {
          console.log("u: " + element.name); //username that will show his tasks
          setTaskUser(element.name);
        });
      });

      collectionRef = collection(db, "assigned_tasks");

      q = query(collectionRef, where("uid", "==", route.params.uidTask));

      unsuscribe = onSnapshot(q, (querySnapshot) => {
        let qAssigned_tasks = querySnapshot.docs.map((doc) => ({
          timestamp: doc.data().timestamp,
          uid: doc.data().uid,
          active_tasks: doc.data().active_tasks,
          markedTasks: doc.data().marked_tasks,
          controlMarkedTasks: doc.data().control_marked_tasks,
        }));
        let controlMarkedTasks = [];
        let activeTasks = [];
        let markedTasks = [];
        qAssigned_tasks.forEach((element) => {
          activeTasks = element.active_tasks;
          markedTasks = element.markedTasks;
          controlMarkedTasks = element.controlMarkedTasks;
          if (markedTasks) {
            console.log("se encontraron tareas marcadas");
            setCheckList(markedTasks);
          }
          if (controlMarkedTasks) {
            console.log("se encontraron tareas de control marcadas");
            setControlCheckList(controlMarkedTasks);
          }
        });
        if (activeTasks) {
          setActiveTasks(activeTasks);
        }
      });

      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log("ya tienes sesión iniciada con:" + route.params.uid);
        }
        return unsuscribe;
      });
    },
    [route],
    [checkList],
    [activeTasks]
  );

  // Return HomeScreen
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            marginTop: 30,
            marginBottom: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CasaImg />
        </View>

        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate("Tasks", { uid: route.params.uid });
          }}
        >
          <Text>Ir a Tasks</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={irACrearSector}>
          <Text>Ir a Crear Sector</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={logActiveTasks}>
            <Text>Ver tareas activas</Text>
          </TouchableOpacity> */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.subtitleSection}>
            Tareas de {taskUser} asignadas esta semana: {checkList.length}{" "}
          </Text>
        </View>
        <View style={{ height: "60%", flex: 1 }}>
          <SectionList
            sections={activeTasks}
            renderItem={renderAssignedTasks}
            renderSectionHeader={({ section: { sector } }) => (
              <Text style={styles.SectionHeader}>{sector}</Text>
            )}
          />
          <TouchableOpacity
            onPress={() => {
              if (route.params.uid == "UDUaYCyuVJYCTP7Y21DJ7ylD8aO2") {
                navigation.navigate("AutoAssignTaskScreen", {
                  uid: route.params.uid,
                });
              }else{
                alert('solo admin');
              }
              
            }}
          >
            <Text>Asignar tareas automaticamente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              marginBottom: 30,
              backgroundColor: "#2d7ac0",
              alignItems: "center",
              alignSelf: "center",
              width: 70,
            }}
            onPress={() => {
              navigation.navigate("HistorialScreen", {
                uid: route.params.uid,
                uidTask: route.params.uidTask,
                taskUser: taskUser,
              });
            }}
          >
            <HistorialImg />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
