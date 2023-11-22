import { View, ScrollView, Alert, StyleSheet, Text, Modal, Image, TouchableOpacity } from "react-native";
import styles from "../stylesScreens";
import stylesStock from "./stylesStock";

import { memo, useEffect, useState } from "react";
import firebaseConfig from "../../firebase-config";
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, where } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { TextInput } from "react-native-paper";
import Button from "../../components/Button";



const auth = getAuth(app);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const StockScreen = ({ navigation, route }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [existProducts, setExistProducts] = useState(false);
    const [productName, setProductName] = useState('');
    const [measurementUnit, setMeasurementUnit] = useState('');

    
    
    const [uriLastReceip, setUriLastReceip] = useState('');

  

useEffect(() => {

    // let q;
    // let unsuscribe;
    // let u;
    // let collectionRef = collection(db, "user");
    // q = query(collectionRef, where("uid", "==", route.params.uid));
    // unsuscribe = onSnapshot(q, (querySnapshot) => {
    //     u = querySnapshot.docs.map((doc) => ({
    //     name: doc.data().username,
    //     canControl: doc.data().can_control,
    //     }));

    //     u.forEach((element) => {
    //     console.log("u: " + element.name); //username active session
    //     setUser(element.name);
    //     setCanControl(element.canControl);
    //     cControl = element.canControl
    //     console.log('control: ', element.canControl);
    //     });
    // });
    const getProducts = async () => {
        const docRef = doc(db, "stock", 'products');
        const docSnap = await getDoc(docRef);
        
        // if exist update
        if (docSnap.exists()) {
            console.log('data:  '+ docSnap.data());
        } else {
            console.log('no hay data')
            // await setDoc(doc(db, "sectors", sector), {
            //     sector_name: sector,
            //     sector_description: description,
            //   }).then(Alert.alert("Sector Creado"));
        }
    }
    getProducts().catch((err) => console.log(err))
        .then(()=>console.log(''))
    console.log('');



}, [])

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

  const handleCreateProduct = async () => {
    if (!productName) {
        Alert.alert('Falta nombre del producto')
        return
    }
    if (!measurementUnit) {
        Alert.alert('Falta unidad de medida')
        return 
    }  

      await addDoc(collection(db, 'stock'), {
      product_name: productName,
      measurement_unit: measurementUnit,
    }).then(Alert.alert('Producto Agregado'));
  }
  

    return (
        <View style={[styles.container, {backgroundColor: ""} ]}>
            <ScrollView>
              <View style={{marginTop: 20}}>
                <Text style={{color: "#3e3944", fontSize: 35, fontWeight: "40"}}>
                    Lista de productos
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
                  <View style={stylesStock.centeredView}>
                    <View style={stylesStock.modalView}>
                        <View>
                            <Text style={{paddingLeft: 11, marginBottom: -5}}>Nombre de producto</Text>
                            <TextInput
                            style={stylesStock.input}
                            onChangeText={(text) => setProductName(text)}
                            placeholder="Nombre de producto"
                            value={productName}
                            />
                        </View>
                        
                        <View style={{marginTop: 20}}>
                            <Text style={{paddingLeft: 11, marginBottom: -5}}>Unidad de medida</Text>
                            <TextInput
                            style={stylesStock.input}
                            onChangeText={(text) => setMeasurementUnit(text)}
                            placeholder="Unidad de medida"
                            value={measurementUnit}
                            />
                        </View>


                        <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 30, marginBottom: 50}}>
                            <TouchableOpacity
                                style={[stylesStock.button, stylesStock.buttonClose, {marginTop: 10, backgroundColor: "#31a84f"}]}
                                onPress={handleCreateProduct}>
                                <Text style={stylesStock.textStyle}>Ok</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            style={[stylesStock.button, stylesStock.buttonClose, {marginTop: 10, backgroundColor: "#d33"}]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={stylesStock.textStyle}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                      
                    </View>
                  </View>
                </Modal>

                <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly", marginTop: 30, marginBottom: 50}}>
                  
                    <TouchableOpacity style={[stylesStock.button, stylesStock.buttonOpen, {backgroundColor: "#31a84f"}]} 
                    disabled={modalVisible}
                    onPress={() => setModalVisible(true)}>
                    <Text style={stylesStock.textStyle}>Agregar producto</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[stylesStock.button, stylesStock.buttonOpen]}
                        onPress={() => setModalVisible(true)}>
                        <Text style={stylesStock.textStyle}>Ultima compra</Text>
                    </TouchableOpacity>
                    
                </View>
                
                

                
                {/* {stockActualVisible && (
                  <SectionStockActual />
                )} */}
                <View style={styles.center}>
                    {(!existProducts || modalVisible) && (
                        <Text>No hay productos</Text>
                    )}
                </View>
                

                
            </ScrollView>
        </View>
    )

}
  export default memo(StockScreen);
    