import { View, ScrollView, Alert, Text, Modal, Image, TouchableOpacity } from "react-native";
import styles from "../stylesScreens";
import stylesStock from "./stylesStock";

import { memo, useEffect, useState } from "react";
import firebaseConfig from "../../firebase-config";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";

import { TextInput } from "react-native-paper";
import { getProducts } from "./getProducts";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function ProductsScreen({ navigation, route }){

    const [modalVisible, setModalVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [existProducts, setExistProducts] = useState(false);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState(0);
    const [change, setChange] = useState('0');
    const [measurementUnit, setMeasurementUnit] = useState('Litro');


useEffect(() => {
  getProducts().then((listProducts)=> {
    setProducts(listProducts)
    setExistProducts(true)
  })

}, [change])


  const DeleteImg = memo(() => (
    <Image
          style={{ width: 25, height: 25 }}
          source={require("../../assets/tachoBasura.png")}
    />
  )
);

  const handleCreateProduct = async () => {
    if (!productName) {
        Alert.alert('Falta nombre del producto')
        return
    }
    if (!measurementUnit) {
        Alert.alert('Falta unidad de medida')
        return 
    }
    if (!price) {
      Alert.alert('Falta precio')
      return 
    }   

    let product = {
      productName: productName,
      measurementUnit: measurementUnit,
      price: price
    }
      await addDoc(collection(db, 'products'), {
        product_name: productName,
        measurement_unit: measurementUnit,
        price: price}).then(() => {
        let newProducts = products
        newProducts.push(product)
        setChange(productName)
        return Alert.alert('Producto Agregado')
      })
      
  }

  const deleteProduct = async ({product}) => {
    let productName = product.productName
    let id = product.id
    let newProducts = products
    await deleteDoc(doc(db, "products", id)).then(() => {
      Alert.alert('Se elimino el producto '+ productName+' con exito')
      newProducts = newProducts.filter(product => product.id != id)
      setProducts(newProducts)
    }).catch((err)=>Alert.alert(err))
  }

  const areYouSureDeleteProduct = ({product}) => {
      let id = product.id
      let productName = product.productName

      return Alert.alert("Vas a eliminar el producto "+ productName, "Estas seguro?", [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },    
        { text: "OK", onPress: () => deleteProduct({product}) },
      ]);
  }


  const DeleteBtn = ({product}) => (
    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginRight: 5 }}>
      <TouchableOpacity onPress={() => areYouSureDeleteProduct({product})}>
        <DeleteImg />
      </TouchableOpacity>
    </View>
  )


  
  const Price = ({product}) => {

    let price = product.price
    let measurementUnit = product.measurementUnit
    let text = `${price}/${measurementUnit}`

    return(
      <View style={{ marginRight: 5 }}>
        <Text style={stylesStock.textPrice}>{text}</Text>
      </View>
    )
  } 

  
  
  const Item = ({product}) => {

    return (
      <View style={[styles.viewSeccionColors, {flexDirection: "row", justifyContent: "space-between"}]}>
        <View style={[stylesStock.viewItem, {flexDirection: "row", flex: 1, justifyContent: "center", alignItems: "center"}]}>
          <View>
            <Text style={styles.titleSectionlist}>{product.productName}</Text>
          </View>
          <View style={{flex:1}}></View>
          <Price product={product}/>
        </View>
        <DeleteBtn product={product}/>

      </View>
    )
  }


  const ProductsList = () => {

    if (modalVisible) {
      return
    }else{
      if(!existProducts){
        return <Text>No hay productos</Text>
      }
    }

    return (  
      (products.map((product, i) => {
        return <Item key={i} product={product} />
      }))
      
    )
  }

    return (
        <View style={[styles.container, {backgroundColor: ""} ]}>
            <ScrollView>
              <View style={{marginTop: 20}}>
                <Text style={{color: "#3e3944", fontSize: 35, fontWeight: "40"}}>Lista de productos</Text>
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
                          <View style={{marginTop: 20}}>
                              <Text style={{paddingLeft: 11, marginBottom: -5}}>Precio</Text>
                              <TextInput
                              style={stylesStock.input}
                              onChangeText={(text) => setPrice(text)}
                              placeholder={`Precio/${(measurementUnit) ? measurementUnit : 'unidad de medida'}`}
                              value={price}
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
                    
                </View>
                
                <ScrollView>
                    <ProductsList />
                </ScrollView>
                

                
            </ScrollView>
        </View>
    )

}
    