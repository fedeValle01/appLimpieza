import { View, ScrollView, Alert, StyleSheet, Text, Pressable, Modal, Image } from "react-native";
import styles from "./stylesScreens";
import { memo, useEffect, useState } from "react";
import firebaseConfig from "../firebase-config";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';

function copyOfScriptStock () {
  
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
}
const styleModal = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#2196F3',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    paddingLeft: 30,
    paddingRight: 30
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

const StockScreen = ({ navigation, route }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [stockActualVisible, setStockActualVisible] = useState(false);

  const [uriLastReceip, setUriLastReceip] = useState('');

  
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


  const LastReceiptImg = memo(() => {

    if(uriLastReceip){
      return (
        <Image
          style={{ width: 300, height: 600 }}
          source={{uri: uriLastReceip}}
        />
      )
    }
    else {
      return (<Text>No hay imagen del ultimo comprobante</Text>)
    }
  }
  )

  
  const ArrowBack = memo((params) => (
    <Image
        style={{ width: 23, height: 23 }}
        source={require("../assets/arrow_back.png")}
      />
  ))

  
  const SectionStockActual = () => {

    return(
      <View>
        <Text style={styles.subtitleSection}>Ultimo inventario</Text>
      </View>
    )
  }

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



    //---------------  NAVBAR  ----------------
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Pressable
            onPress={() =>
              navigation.navigate("Usuarios", { uid: route.params.uid, canControl: route.params.canControl })
            }
          >
            <View style={{ alignContent: "center" }}>
              <Text>usuarios</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate("Products", { uid: route.params.uid, canControl: route.params.canControl })
            }
          >
            <View style={{ alignContent: "center" }}>
              <Text style={styles.navItem}>Lista de productos</Text>
            </View>
          </Pressable>


          
        </View>
      ),
      headerLeft: () => (
                          <View style = {{marginRight:30, alignItems: "center", justifyContent: "center"}}>
                            <Pressable
                              onPress={() => navigation.goBack('appLimpieza', {uid: route.params.uid, uidTask: route.params.uid, loading: true})}>
                                <ArrowBack />
                            </Pressable>
                          </View>
      )
    });
    //-----------NAVBAR------------------





    const storage = getStorage();
    const pathReceipts = ref(storage, 'images/receipts');
      
      listAll(pathReceipts).then((res) => {
        
        let lastReceip = res.items[res.items.length-1]

          console.log('imagen: '+lastReceip);
  
          getDownloadURL(ref(storage, lastReceip))
          .then((url) => {
            console.log('esta url en url '+url);
            setUriLastReceip(url)
          })
          .catch((error) => {
             Alert.alert(error)
          });
  
      }).catch((error) => {
        Alert.alert(error)
      }).finally( () => console.log('listo'))
  
    
  },[])

  

  function scriptStock () {
    let productoss = [{nombre: 'Lavandina' , unidadMedida: 'Litros', precio: 0  },
    {nombre: 'Lavandina en gel' , unidadMedida: 'Litros', precio: 0  },
    {nombre: 'Desodorante piso lisoform' , unidadMedida: 'Litros', precio: 0  },
    {nombre: 'Desodorante piso pino' , unidadMedida: 'Litros', precio: 0  },
    {nombre: 'Desodorante piso limon' , unidadMedida: 'Litros', precio: 0  },
    {nombre: 'Detergente magistral' , unidadMedida: 'Litros', precio: 0  },
    {nombre: 'Detergente magistral' , unidadMedida: 'Litros', precio: 0  },
    {nombre: 'Jabón manos dove' , unidadMedida: 'Litros', precio: 0  },
    {nombre: 'Jabón manos melón' , unidadMedida: 'Litros', precio: 0 },
    {nombre: 'Bolsas' , unidadMedida: 'Litros', precio: 0 },
    {nombre: 'Bolsas2' , unidadMedida: 'Litros', precio: 0 },
    {nombre: 'Bolsas3' , unidadMedida: 'Litros', precio: 0 }]

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
  }

 
  

    return (
        <View style={[styles.container, {backgroundColor: ""} ]}>
            <ScrollView>
              <View style={{marginTop: 20}}>
                <Text style={{color: "#3e3944", fontSize: 35, fontWeight: "40"}}>
                    Control de Stock
                </Text>
              </View>
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
                      <LastReceiptImg />
                      <Pressable
                        style={[styleModal.button, styleModal.buttonClose, {marginTop:10}]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styleModal.textStyle}>Ok</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>

                <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly", marginTop: 30, marginBottom: 50}}>
                  <Pressable
                    style={[styleModal.button, styleModal.buttonOpen]}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styleModal.textStyle}>Ultima compra</Text>
                  </Pressable>
                  <Pressable
                    style={[styleModal.button, styleModal.buttonOpen]}
                    onPress={pickImageAsync}>
                    <Text style={styleModal.textStyle}>Subir compra</Text>
                  </Pressable>
                </View>
                
                

                <Pressable style={[styleModal.button, styleModal.buttonOpen, {backgroundColor: "#31a84f"}]} 
                  onPress={() => stockActualVisible ? setStockActualVisible(false) : setStockActualVisible(true)}>
                  <Text style={styleModal.textStyle}>Stock Actual</Text>
                </Pressable>
                {stockActualVisible && (
                  <SectionStockActual />
                )}
                <Text style={styles.subtitleSection}>Estimación de gasto</Text>

                
            </ScrollView>
        </View>
    )

}
  export default memo(StockScreen);
    