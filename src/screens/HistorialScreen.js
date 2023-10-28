import React, { useEffect, useState } from "react";
import {Text,SafeAreaView,TextInput,TouchableOpacity,Alert,SectionList,View, ScrollView,} from "react-native";

import LoadingGif  from "../components/Loading"
import {doc,setDoc,getFirestore,collection,orderBy,query,where,onSnapshot, updateDoc,} from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebase-config";
import styles from "../screens/stylesScreens";
import { Checkbox } from "react-native-paper";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const DATA = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];

export default function HistorialScreen({ navigation, route }) {
  const [history, setHistory] = useState([]);
  const [haveHistory, setHaveHistory] = useState(false);
  const [taskUser, setTaskUser] = useState(null);

    let cont = -1;
    let vuelta = 0;
  useEffect(() => {
    let q;
    let unsuscribe;
    let collectionRef = collection(db, "assigned_tasks");
    setTaskUser(route.params.taskUser)
    q = query(collectionRef, where("uid", "==", route.params.uidTask));

    unsuscribe = onSnapshot(q, (querySnapshot) => {
      let qhistory = querySnapshot.docs.map((doc) => ({
        history: doc.data().history,
        uid: doc.data().uid,
      }));

      if (qhistory) {
        console.log("hay hist");

        qhistory.forEach((element) => {
          if (element.history){
            setHistory(element.history.reverse());
            setHaveHistory(true);
          }
        });
      }
    });
  }, []);

const TitleSection = ({ timestamp }) => {


  let dateTime = timestamp.toDate();
  dateTime.setUTCHours(dateTime.getUTCHours() + 2);
  
  let firstDay = new Date(
    dateTime.getFullYear(),
    dateTime.getMonth(),
    dateTime.getDate() - dateTime.getDay() + 1
  );
  // Get the last day of the week
  let lastDay = new Date(
    dateTime.getFullYear(),
    dateTime.getMonth(),
    dateTime.getDate() + (7 - dateTime.getDay())
  );

  const mensaje = "Semana del " +
  firstDay.getDate() +
  "/" +
  (firstDay.getMonth() + 1) +
  "/" +
  firstDay.getFullYear() +
  " al " +
  lastDay.getDate() +
  "/" +
  (lastDay.getMonth() + 1) +
  "/" +
  lastDay.getFullYear();



  return (
    <View style={styles.viewTitleDate}>
      <Text style={styles.titleDate}>{mensaje}</Text>
    </View>
  )
} 

  
  const Item = ({ title }) => (
    <View style={styles.itemSectionlist}>
      <Text style={styles.titleSectionlist}>{title}</Text>
    </View>
  );


  const renderAssignedTasks = ({ item, index }, check, i) => {
    if (vuelta == i){
      cont++;
    }else{
      vuelta = i;
      cont = 0;
    }
    return (
      <View style={styles.viewSeccion}>
        <View>
          <Item title={item} />
        </View>
        <View style={{ flex: 1 }}/>
        
        <View style={{ flexDirection: "row", alignItems: "center", position: "absolute", right: 0 }}>
          <Text>{cont}</Text>

          

          <View style={{ flexDirection: "row", alignItems: "center" }}>
           
            <View>
              {/* control checkbox */}
              <Checkbox
                color="#39ff14"
                status={check[cont]}
                disabled = {true}

              />
            </View>
          </View>
        </View>
      </View>
    );
  };

const Section3 = () =>{
  return(
    <SafeAreaView>
      {haveHistory && (
        history.map((t, i) => {
          const check = t.control_marked_tasks;
          return(
            <SafeAreaView>
              <TitleSection timestamp={t.timestamp}/>
                <SectionList
                scrollEnabled={false}
                sections={t.data}
                renderItem={(props) => renderAssignedTasks(props, check, i)}
                renderSectionHeader={({section: {sector}}) => (
                  <Text style={styles.SectionHeader}>{sector}</Text>
                )}
                />
            </SafeAreaView>
        )
        })
      )}
      {!haveHistory && (
          <Text style = {styles.inHouseTitle}>Historial vacio</Text>
      )}
    
    </SafeAreaView>
    
  )
}


const copyHistorial = () => {
  let q;
    let unsuscribe;
    let collectionRef = collection(db, "assigned_tasks");
    q = query(collectionRef, where("uid", "==", 'LU5pAgjhmlhzd9gCwXmVCLDPNET2')); //COPY FROM

    unsuscribe = onSnapshot(q, async (querySnapshot) => {
      let qhistory = querySnapshot.docs.map((doc) => ({
        history: doc.data().history,
      }));
      console.log(qhistory);
      await updateDoc(doc(db, "assigned_tasks", 'B1q2u3ZDguZkVGyNeNbqGZVsp512'), { // TO
        history,
      }).catch((error) => {
        alert(error);
      });
    })
}

const HistorySubtitle = () => {
  return(
    <SafeAreaView>
        <Text style={styles.subtitleSection}>Historial de {taskUser}</Text>
    </SafeAreaView>

  )
}

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 12,
        }}
      >
        
      {taskUser && (<HistorySubtitle/>)}
          <View style={{ height: "60%", flex: 1, marginTop: 12}}>
            <ScrollView>
              {!haveHistory && <LoadingGif/>}
              <Section3 />
            </ScrollView>
          </View>

      </View>
    </SafeAreaView>
  );
}
