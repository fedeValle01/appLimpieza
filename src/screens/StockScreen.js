import { View, ScrollView, Alert, StyleSheet, Text, Pressable, Modal, Image } from "react-native";
import styles from "./stylesScreens";
import { memo, useEffect, useState } from "react";
import firebaseConfig from "../firebase-config";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

import { getStorage, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';


const styleModal = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

const auth = getAuth(app);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default function StockScreen () {

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      let url = result.assets[0];
      url = url.uri
      let image = await (await fetch(url)).blob()
      
      // Create a root reference
      const storage = getStorage();
      
      let name = url.split('/')
      name = name.pop()
      console.log('nombre: '+name);
      let pathInFirebase = `images/receipts/${name}`
      const storageRef = ref(storage, pathInFirebase);

      //'file' comes from the Blob or File API
      uploadBytes(storageRef, image).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });

    } else {
      alert('No seleccionaste ninguna imagen');
    }
  };



  const Factura = memo(() => (
    <Image
      style={{ width: 300, height: 600 }}
      source={require("../assets/factura26-06-2023.jpeg")}
    />
  ));
  


  useEffect(()=>{



    // const getStock = async () => {
    //   const docRef = doc(db, "stock", "SF");
    //   const docSnap = await getDoc(docRef);
  
    //   if (docSnap.exists()) {
    //     console.log("Document data:", docSnap.data());
    //   } else {

    //       await setDoc(doc(db, "stock", "factura"), {
    //         img: Factura,
    //         date: '26-06-2023'
    //       });
    // }
    // }
  
    // getStock()
    
    
  },[])



  let productos = ['Lavandina', 'Lavandina en gel', 'Desodorante piso lisoform', 'Desodorante piso pino', 'Desodorante piso limon', 'Detergente magistral', 'Jabón manos dove', 'Jabón manos melón', 'Jabón manos uva']
  console.log('----Stock productos 24/06/2023-------')
  let litrosActual = [16,4,2,0,1,8,5,1,0.5];
  console.log('Quiero saber los litros que se gastan de cada producto por mes')

  const msjGasto = 'Se gasto del 14/03/2023 al 24/06/2023'
  console.log(msjGasto)
  let diasGasto=102
  let litrosGastados=[14,2,21,5,1,8,5,1,0.5];

  litrosGastados.forEach(function(prod, i) {
    console.log(productos[i]+ ': '+ prod+' L')
  });

  console.log('Equivale a un gasto diario de:')
  litrosGastados.forEach(function(litro, i) {
    console.log(productos[i]+ ': '+ (litro/diasGasto).toFixed(4) +' L')
  });

  console.log('Equivale a un gasto mensual de:')
  litrosGastados.forEach(function(litro, i) {
    console.log(productos[i]+ ': '+ ((litro/diasGasto)*30).toFixed(4) +' L')
  });

  console.log('Estimando lo que se gasta en 4 meses')
  litrosGastados.forEach(function(litro, i) {
    console.log(productos[i]+ ': '+ ((litro/diasGasto)*120).toFixed(4) +' L')
  });
  const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={[styles.container, {backgroundColor: ""} ]}>
            <ScrollView>
                <Text style={styles.titleHeader}>
                    Control de Stock
                </Text>
                <Text style={styles.subtitleSection}>Ultima compra</Text>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                  }}>
                  <View style={styleModal.centeredView}>
                    <View style={styleModal.modalView}>
                      <Text style={styleModal.modalText}>Hello World!</Text>
                      <Pressable
                        style={[styleModal.button, styleModal.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styleModal.textStyle}>Ok</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
                <Pressable
                  style={[styleModal.button, styleModal.buttonOpen]}
                  onPress={() => setModalVisible(true)}>
                  <Text style={styleModal.textStyle}>Ultima compra</Text>
                </Pressable>
                <Pressable
                  style={[styleModal.button, styleModal.buttonOpen]}
                  onPress={pickImageAsync}>
                  <Text style={styleModal.textStyle}>Subir imagen</Text>
                </Pressable>
                <Factura />
            </ScrollView>
        </View>
    )

    
    
}