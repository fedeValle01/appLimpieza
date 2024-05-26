import React, {useEffect, useState, Component} from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setUserCredential, signInWithCredential, getIdToken} from 'firebase/auth'
import { doc, setDoc, getFirestore, collection, query, onSnapshot, orderBy, where, getDocs } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { initializeApp } from 'firebase/app'
import TextInput from "../components/TextInput";

import firebaseConfig from '../firebase-config';
import Button from '../components/Button';
import Header from '../components/Header';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



export default function GroupScreen({navigation, route}) {

    

    const [uid, setUid] = useState([]);
    const [haveGroup, setHaveGroup] = useState(false);
    const [UserCredential, setUserCredential] = useState([]);
    

    useEffect(() =>{
        if (!route.params.group){
            console.log('no tiene grupo');
        }
    },[])

    
    const createUser = async (uid) =>{
        await setDoc(doc(db, 'user', uid), {
        username: name,
        uid: uid,
        });
    }

    const handleJoinGroup = async (code) => {
        console.log(code);
    }

    const handleCreateGroup = async () => {
        console.log('crear grupo');
    }

const viewName = () => {
    if(uid!=""){
      uid.forEach((uid) => {
        setName(uid.username);
        // console.log('name: '+name);
      });
  }
}

const InputGroup = () => {
    const [code, setCode] = useState('');
    
    return(
        <View>
            <View>
                <TextInput
                    label="Codigo"
                    returnKeyType="done"
                    value={code}
                    onChangeText = {(text) => setCode(text)}
                />
            </View>
            
            <Button mode="contained" onPress={() => handleJoinGroup(code)}>
                <Text>Unirse a grupo</Text>
            </Button>

            
        </View>
    )
}
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("ya tienes sesión iniciada con: "+name+', UID: '+user.uid);
        
        const collectionRef = collection(db, 'user');
        const q = query(collectionRef, where("uid", "==", user.uid));
        const unsuscribe = onSnapshot(q, querySnapshot =>{
          setUid(
            querySnapshot.docs.map(doc =>({
              username: doc.data().username,
            }
            ))
          )
          
        })
        navigation.navigate('appLimpieza', {uid: user.uid})
        
        return unsuscribe;
    }
        
    });
  }, []);

  return (
    
    <SafeAreaView style = {styles.container}>
      
      {(!haveGroup) && (
        <View style={{width: 200}}>
            <Header><Text style={{color: "#222"}}> No tenes un grupo</Text></Header>

            <InputGroup />
            <Button style={{marginTop: 50}} mode="contained" onPress={() => handleJoinGroup(code)}>
                <Text>Crear Grupo</Text>
            </Button>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    forgotPassword: {
      width: "100%",
      alignItems: "flex-end",
      marginBottom: 24,
    },
    row: {
      flexDirection: "row",
      marginTop: 4,
    },
    container: {
      flex: 1,
      backgroundColor: "#eeeeee",
      alignItems: "center",
      justifyContent: "center",
    },
  });
  