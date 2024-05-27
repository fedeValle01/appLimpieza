import React, {useEffect, useState, Component} from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, View, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setUserCredential, signInWithCredential, getIdToken} from 'firebase/auth'
import { doc, setDoc, getFirestore, collection, query, onSnapshot, orderBy, where, getDocs, addDoc, getDoc, writeBatch, updateDoc } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import { initializeApp } from 'firebase/app'
import TextInput from "../components/TextInput";

import firebaseConfig from '../firebase-config';
import Button from '../components/Button';
import Header from '../components/Header';
import { BlurView } from 'expo-blur';
import styleModal from './styleModal';
import { Modal } from 'react-native';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const batch = writeBatch(db);



export default function GroupScreen({navigation, route}) {
    
    // const [uid, setUid] = useState(route.params.uid);
    const [uid, setUid] = useState("UDUaYCyuVJYCTP7Y21DJ7ylD8aO2");
    
    const [haveGroup, setHaveGroup] = useState(false);
    const [modalCreateGroup, setModalCreateGroup] = useState(false);
    

    useEffect(() =>{
        if (!route.params.group){
            console.log('no tiene grupo');
        }
        console.log(route.params.group);
    },[])


    const handleJoinGroup = async (code) => {
        const docRef = doc(db, "groups", code);
        const group = await getDoc(docRef);
        if (!group.exists()) return (Alert.alert(`El grupo con codigo: "${code}" no existe `))

            const success = await addUserToGroup(uid, code)
            if (success) navigation.navigate("appLimpieza", { uid: uid, uidTask: uid, groupCode: code, firstTime: true })
        
    }

    const createGroup = async (name) => {
        let id = ''
        const group = await addDoc(collection(db, "groups"), {
            name: name,
            owner: uid
            }).then((res)=> id = res.id)
        return id
    }

    const addUserToGroup = async (uid, idGroup) => {
        let success = false
        let newUsersInGroup = []
        const group = doc(db, 'groups', idGroup)
        const groupSnap = await getDoc(group);
        let usersInGroup = groupSnap.data().users
        
        if (!usersInGroup) {
            newUsersInGroup.push(uid)
        }else{
            usersInGroup.push(uid)
            newUsersInGroup = usersInGroup
        }
        console.log("Document data:", groupSnap.data().users);
        console.log("newUsersInGroup");
        console.log(newUsersInGroup);
        await updateDoc(doc(db, "groups", idGroup), {
            users: newUsersInGroup
        }).then(() => success = true)
        return success
    }
    
    const handleCreateGroup = async (name) => {

        const groupCode = await createGroup(name)
        if (!groupCode) return (Alert.alert(`Fallo al crear el grupo, intente de nuevo`))

        const success = await addUserToGroup(uid, groupCode)
        if (!success) return Alert.alert(`Fallo al agregar usuario al grupo`)

        Alert.alert(`El grupo ${name} fue creado exitosamente!`)
        navigation.navigate("appLimpieza", { uid: uid, uidTask: uid, groupCode: groupCode, firstTime: true })
        
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

const FormCreateGroup = () => {
    const [name, setName] = useState('')
    return(
        <View  style={{width: 200}}>
            <TextInput
                label="Nombre del grupo"
                returnKeyType="done"
                value={name}
                onChangeText = {(text) => setName(text)}
            />
            <Button style={{marginTop: 50}} mode="contained" onPress={() => handleCreateGroup(name)}>
                <Text>Crear Grupo</Text>
            </Button>
        </View>
    )
}

const closeModal = () => {
    setModalCreateGroup(false)
}

const SectionCreateGroup = () => {
    
    return(
        <BlurView tint="dark" intensity={80} style={[styleModal.centeredView, {marginTop: -50}]}>
            <View style={styleModal.modalView}>
            <View style={{marginTop: 20}}>
                <FormCreateGroup />
            </View>
            </View>
        </BlurView>
    )
}

  return (
    
    <SafeAreaView style = {styles.container}>
      
      {(!haveGroup) && (
        <View style={{width: 200}}>

            <Header><Text style={{color: "#222"}}>No estas en ningun grupo</Text></Header>
            <InputGroup />

            <Button style={{marginTop: 50}} mode="contained" onPress={() => setModalCreateGroup(true)}>
                <Text>Crear Grupo</Text>
            </Button>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalCreateGroup}
                onRequestClose={() => {
                    setModalCreateGroup(false)
            }}>
                <SectionCreateGroup />
            </Modal>
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
  