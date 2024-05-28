import React, { memo, useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, View, Alert, ScrollView, Image, RefreshControl } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot, where, updateDoc, doc, getDoc, runTransaction } from "firebase/firestore";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import { getState } from "../helpers/getStates";
import { getUsersUID } from "../helpers/getUsersUID";
import { getUserList } from "../helpers/getUserList";
import { getAssignedTasks } from "../helpers/getAssignedTasks";

export default function TaskScreen({ navigation, route }) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const [user, setUser] = useState([]); //user who see their own tasks
  const [groupUsers, setGroupUsers] = useState([]); //all the users
  const [usersInHome, setUsersInHome] = useState([]);
  const [usersOutHome, setUsersOutHome] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [groupName, setGroupName] = useState("terr");

  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1400);
  }, []);
  
  
  
  useEffect(() => {

    console.log('useEffect');

    const getUsersAndSectors = async () => {
    console.log('getUsersAndSectors');
    console.log(route.params.groupCode);

    
      let assignedTasks = await getAssignedTasks(route.params.groupCode)
      let usersUID = await getUsersUID(route.params.groupCode)
      console.log(usersUID);

      let u = await getUserList(usersUID)
      console.log(u);

      console.log('userFinal',u);
      
      u.forEach((user, i) => { //binding sectors to users
        let uid = user.uid
        user.state = 'none'
        user.sectors = ['No tiene tareas asignadas']
        let sectors = []
          assignedTasks.forEach(assignedTask => {
            let uidAssignedTask = assignedTask.uid
            let haveTasks = false
            if (uid == uidAssignedTask){
              let activeTasks = assignedTask.active_tasks
              let control = assignedTask.control_marked_tasks
              let marked = assignedTask.marked_tasks
              if(activeTasks){
                haveTasks = true
                activeTasks.forEach(sector => {
                  sectors.push(sector.sector)
                });
                
                let stateGet = getState(marked, control, haveTasks);
                user.state = stateGet
                user.sectors = sectors
              }
            }

          });
      });

      

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
      setGroupUsers(u);

    }

    getUsersAndSectors()
    
  }, [refresh]);

  


  const CircleYellow = memo(() => (
    <View style={{marginLeft: 12}}>
      <Image
        style={{ width: 11, height: 11 }}
        source={require("../assets/circle-yellow.png")}
      />
    </View>
  ));
  const CircleBlue = memo(() => (
    <View style={{marginLeft: 12}}>
      <Image
        style={{ width: 11, height: 11 }}
        source={require("../assets/circle-blue.png")}
      />
    </View>
  ));
  const CircleGreen = memo(() => (
    <View style={{marginLeft: 12}}>
      <Image
        style={{ width: 11, height: 11 }}
        source={require("../assets/circle-green.png")}
      />
    </View>
  ));
  const Crown = memo(() => (
    <View>
      <Image
        style={{ width: 15, height: 15 }}
        source={require("../assets/crown.png")}
      />
    </View>
  ));


  const State = (props) => {
    let state = props.state
    if (state == 'finished'){ //admin marked all tasks completed
      return (<CircleGreen/>)
    }else if (state == 'completed'){ //user marked one or more as completed
      return (<CircleBlue/>)
    }else if (state == 'active'){ //have a tasks assigned without checks
      return (<CircleYellow/>)
    } //else the user don't have assigned tasks
   
  }
  
  const changeOnHome = async (uid, inHome, setChangeOnHome) => {
    
    let users = groupUsers
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.uid== uid) {
        user.in_home = !user.in_home
        break
      }
    }
    setGroupUsers((prev) => prev = users)
    setChangeOnHome((prev) => prev = !prev)
    await updateDoc(doc(db, "user", uid), {
      in_home: !inHome,
    });
  }


  const ListItem = (props) => {
    let sectors = props.sectors
    let canControl = props.canControl
    
    return (
      <SafeAreaView>
        <TouchableOpacity
          style={styles.btnUsuario}

          onPress = {() => {
            navigation.navigate("appLimpieza", {
              uid: route.params.uid,
              uidTask: props.uid,
              fromUserScreen: true,
            });
          }}

          onLongPress = {() => {
            
            if(route.params.canControl == true){
              console.log('changeHome');
              changeOnHome(props.uid, props.inHome, props.setChangeOnHome)
              console.log('changeOnHome');
            }
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center", marginRight: 15}}>
              {canControl == true && (<Crown />)}
            <View style={{ flex: 1, flexDirection: "row"}}>
              <View style={{ alignSelf: "center"}}>
                <Text style={styles.txtUser}>{props.value}</Text>
              </View>
              <View style={styles.circle}>
                <State state={props.states}/>
              </View>
            </View>
          {sectors && (sectors.map(sector => (
            <Text style={styles.pSector}> {sector}</Text>
          )))}
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  
  const SectorList = () => {

    const [changeOnHome, setChangeOnHome] = useState(false);
    console.log('render SectorList');
    let users = groupUsers

    let namesInHome = []
    let UidsInHome = []
    let sectorsInHome = []
    let statesInHome = []
    let canControlInHome = []
    
    let statesOutHome = []
    let namesOutHome = []
    let UidsOutHome = []
    let sectorsOutHome = []
    let canControlOutHome = []


    if (users != "") {
      let indexInHome = 0
      let indexOutHome = 0

      users.forEach((user) => {
        if(user.in_home){
          namesInHome[indexInHome] = user.username
          UidsInHome[indexInHome] = user.uid
          sectorsInHome[indexInHome] = user.sectors
          statesInHome[indexInHome] = user.state
          canControlInHome[indexInHome] = user.canControl

          indexInHome++
        }else{
          namesOutHome[indexOutHome] = user.username
          UidsOutHome[indexOutHome] = user.uid
          sectorsOutHome[indexOutHome] = user.sectors
          statesOutHome[indexOutHome] = user.state
          canControlOutHome[indexOutHome] = user.canControl

          indexOutHome++
        }
      });
      let cantUsersInhome = namesInHome.length
      let cantUsersOuthome = namesOutHome.length

      return (
        <View>
          <ScrollView
            contentContainerStyle={styles.scrollViewHome}
            >

            
          {cantUsersInhome>0 && <Text style={styles.inHouseTitle}>En casa</Text>}
          {cantUsersInhome==0 && <Text style={styles.inHouseTitle}>No hay usuarios en casa</Text>}
          <Text>
            {namesInHome.map((nombre, i) => (
              <View key={nombre.toString()}>
                <ListItem
                  value={nombre}
                  inHome={true}
                  uid={UidsInHome[i]}
                  sectors={sectorsInHome[i]}
                  states={statesInHome[i]}
                  canControl={canControlInHome[i]}
                  setChangeOnHome={setChangeOnHome}
                />
              </View>
            ))}
          </Text>

          
          {cantUsersOuthome>0 && <Text style={styles.inHouseTitle}>Fuera de casa</Text>}
          {cantUsersOuthome==0 && <Text style={styles.inHouseTitle}>No hay usuarios fuera de casa</Text>}

          <Text>
            {namesOutHome.map((nombre, i) => (
              <View key={nombre.toString()}>
                <ListItem
                  value={nombre}
                  inHome={false}
                  uid={UidsOutHome[i]}
                  sectors={sectorsOutHome[i]}
                  states={statesOutHome[i]}
                  canControl={canControlOutHome[i]}
                  setChangeOnHome={setChangeOnHome}
                />
              </View>

            ))}
          </Text>
          </ScrollView>
        </View>
      );
    } else {
      console.log("no hay usuarios");
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              width: "90%",
              height: "90%"
            }}
          >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { onRefresh(); setRefresh(refresh ? false : true)}} />
          }>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 5,
                  marginTop: 16,
                }}
              >
                <Text style={styles.subtitleSection}>
                  {" "}
                  Grupo {groupName}
                  Tareas asignadas de los usuarios
                </Text>
              </View>
            <SectorList />

      </ScrollView>

          </View>
    </SafeAreaView>
  );
}
