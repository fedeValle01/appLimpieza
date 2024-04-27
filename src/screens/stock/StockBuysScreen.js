import { View, ScrollView, Alert, StyleSheet, Text, Pressable, Modal, Image, TouchableOpacity } from 'react-native'
import { styles, styleModal } from '..'
import stylesStock from './stylesStock'
import { BlurView } from 'expo-blur'

import { memo, useEffect, useState } from 'react'
import firebaseConfig from '../../firebase-config'
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'
import { TextInput } from 'react-native-paper'

import { getProducts } from './getProducts'
import { db, auth, app } from '../../helpers/getFirebase'
function copyOfScriptStock() {

  const productos = ['Lavandina', 'Lavandina en gel', 'Desodorante piso lisoform', 'Desodorante piso pino', 'Desodorante piso limon', 'Detergente magistral', 'Jabón manos dove', 'Jabón manos melón', 'Jabón manos uva']
  console.log('----Stock productos 24/06/2023-------')
  const litrosActual = [16, 4, 2, 0, 1, 8, 5, 1, 0.5]
  console.log('Quiero saber los litros que se gastan de cada producto por mes')

  const msjGasto = 'Se gasto del 14/03/2023 al 24/06/2023'
  console.log(msjGasto)
  const diasGasto = 102
  const litrosGastados = [14, 2, 21, 5, 1, 8, 5, 1, 0.5]

  litrosGastados.forEach(function (prod, i) {
    console.log(productos[i] + ': ' + prod + ' L')
  })

  console.log('Equivale a un gasto diario de:')
  litrosGastados.forEach(function (litro, i) {
    console.log(productos[i] + ': ' + (litro / diasGasto).toFixed(4) + ' L')
  })

  console.log('Equivale a un gasto mensual de:')
  litrosGastados.forEach(function (litro, i) {
    console.log(productos[i] + ': ' + ((litro / diasGasto) * 30).toFixed(4) + ' L')
  })

  console.log('Estimando lo que se gasta en 4 meses')
  litrosGastados.forEach(function (litro, i) {
    console.log(productos[i] + ': ' + ((litro / diasGasto) * 120).toFixed(4) + ' L')
  })
}


export default function StockBuysScreen({ navigation, route }) {


  const [createBtnDisabled, setCreateBtnDisabled] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalControlVisible, setModalControlVisible] = useState(false)
  const [modalStockVisible, setModalStockVisible] = useState(false)
  const [modalRegisterBuy, setModalRegisterBuy] = useState(false)

  const [uriLastReceip, setUriLastReceip] = useState('')
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)

  const [stockProducts, setStockProducts] = useState([])
  const [lastStockProducts, setLastStockProducts] = useState([])



  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      console.log(result)
      let url = result.assets[0]
      url = url.uri
      const image = await (await fetch(url)).blob()

      // Create a root reference
      const storage = getStorage()

      let name = url.split('/')
      name = name.pop()
      console.log('nombre: ' + name)
      const pathInFirebase = `images/receipts/${name}`
      const storageRef = ref(storage, pathInFirebase)

      //'file' comes from the Blob or File API
      uploadBytes(storageRef, image).then((snapshot) => {
        console.log('Uploaded a blob or file!')
      })

    } else {
      Alert.alert('No seleccionaste ninguna imagen')
    }
  }

  
  const LastReceiptImg = memo(() => {

    if (uriLastReceip) {
      return (
        <Image
          style={{ width: 300, height: 600 }}
          source={{ uri: uriLastReceip }}
        />
      )
    }
    else {
      return (<Text>No hay imagen del ultimo comprobante</Text>)
    }
  }
  )


  const ArrowBack = memo(() => (
    <Image
      style={{ width: 23, height: 23 }}
      source={require('../../assets/arrow_back.png')}
    />
  ))

  const WhatsAppIcon = memo(() => (
    <Image
      style={{ width: 36, height: 36 }}
      source={require('../../assets/whatsApp_icon.png')}
    />
  ))


  function scriptStock() {
    const productoss = [{ nombre: 'Lavandina', unidadMedida: 'Litros', precio: 0 },
    { nombre: 'Lavandina en gel', unidadMedida: 'Litros', precio: 0 },
    { nombre: 'Desodorante piso lisoform', unidadMedida: 'Litros', precio: 0 },
    { nombre: 'Desodorante piso pino', unidadMedida: 'Litros', precio: 0 },
    { nombre: 'Desodorante piso limon', unidadMedida: 'Litros', precio: 0 },
    { nombre: 'Detergente magistral', unidadMedida: 'Litros', precio: 0 },
    { nombre: 'Detergente magistral', unidadMedida: 'Litros', precio: 0 },
    { nombre: 'Jabón manos dove', unidadMedida: 'Litros', precio: 0 },
    { nombre: 'Jabón manos melón', unidadMedida: 'Litros', precio: 0 },
    { nombre: 'Bolsas', unidadMedida: 'Litros', precio: 0 },
    { nombre: 'Bolsas2', unidadMedida: 'Litros', precio: 0 },
    { nombre: 'Bolsas3', unidadMedida: 'Litros', precio: 0 }]

    const productos = ['Lavandina', 'Lavandina en gel', 'Desodorante piso lisoform', 'Desodorante piso pino', 'Desodorante piso limon', 'Detergente magistral', 'Jabón manos dove', 'Jabón manos melón', 'Jabón manos uva']
    console.log('----Stock productos 24/06/2023-------')
    const litrosActual = [16, 4, 2, 0, 1, 8, 5, 1, 0.5]
    console.log('Quiero saber los litros que se gastan de cada producto por mes')

    const msjGasto = 'Se gasto del 14/03/2023 al 24/06/2023'
    console.log(msjGasto)
    const diasGasto = 102
    const litrosGastados = [14, 2, 21, 5, 1, 8, 5, 1, 0.5]

    litrosGastados.forEach(function (prod, i) {
      console.log(productos[i] + ': ' + prod + ' L')
    })

    console.log('Equivale a un gasto diario de:')
    litrosGastados.forEach(function (litro, i) {
      console.log(productos[i] + ': ' + (litro / diasGasto).toFixed(4) + ' L')
    })

    console.log('Equivale a un gasto mensual de:')
    litrosGastados.forEach(function (litro, i) {
      console.log(productos[i] + ': ' + ((litro / diasGasto) * 30).toFixed(4) + ' L')
    })

    console.log('Estimando lo que se gasta en 4 meses')
    litrosGastados.forEach(function (litro, i) {
      console.log(productos[i] + ': ' + ((litro / diasGasto) * 120).toFixed(4) + ' L')
    })
  }


  async function getLastStock() {

    if (lastStockProducts.length < 0) return
    const collectionRef = collection(db, 'stock')
    const q = query(collectionRef, orderBy('timestamp', 'desc'), limit(1))
    const querySnapshot = await getDocs(q)
    const lastStock = querySnapshot.docs.map((doc) => ({
      stockProducts: doc.data().stock_products,
      timestamp: doc.data().timestamp
    }))
    return lastStock
  }



  const handleSaveBuy = async () => {

    let isQuantityEmpty = false
    stockProducts.forEach(product => {
      const quantity = product.quantity

      if(quantity == 0){

      }else if (!quantity) {
        isQuantityEmpty = true
        return
      }
    })

    if (isQuantityEmpty) {
      return Alert.alert('Faltan una o mas cantidades')
    } else {
      setCreateBtnDisabled(true)
      await addDoc(collection(db, 'buys'), {
        stock_products: stockProducts,
        timestamp: serverTimestamp()
      }).then(() => {
        Alert.alert('Compra agregada con exito 👌🏻')
        setModalRegisterBuy(false)
      })
    }

  }



  useEffect(() => {
    
    getProducts().then((list) => {
      setStockProducts(list)
      setProducts(list)
    })

    //---------------  NAVBAR  ----------------
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            onPress={() =>
              navigation.navigate('Lista de Productos', { uid: route.params.uid, canControl: route.params.canControl })
            }
          >
            <View style={{ alignContent: 'center' }}>
              <Text style={styles.navItem}>Lista de productos</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate('Compras', { uid: route.params.uid, canControl: route.params.canControl })
            }
          >
            <View style={{ alignContent: 'center' }}>
              <Text style={styles.navItem}>Compras</Text>
            </View>
          </Pressable>
        </View>
      ),
      headerLeft: () => (
        <View style={{ marginRight: 30, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            onPress={() => navigation.goBack('appLimpieza', { uid: route.params.uid, uidTask: route.params.uid, loading: true })}>
            <ArrowBack />
          </Pressable>
        </View>
      )
    })
    //-----------NAVBAR------------------





    const storage = getStorage()
    const pathReceipts = ref(storage, 'images/receipts')

    listAll(pathReceipts).then((res) => {

      const lastReceip = res.items[res.items.length - 1]

      getDownloadURL(ref(storage, lastReceip))
        .then((url) => {
          setUriLastReceip(url)
        })
        .catch((error) => {
          Alert.alert(error)
        })

    }).catch((error) => {
      Alert.alert(error)
    }).finally(() => console.log('listo'))


  }, [])

  //---------end useEfect----------









  const Price = ({ product }) => {

    const price = product.price
    const measurementUnit = product.measurementUnit
    const text = `${price}/${measurementUnit}`

    return (
      <View style={{ marginRight: 5 }}>
        <Text style={stylesStock.textPrice}>{text}</Text>
      </View>
    )
  }


  const handleSetQuantity = (newProduct, i, text) => {


    const txt = text.replace(',', '.')
    const quantity = parseFloat(txt)
    if (isNaN(quantity)) {
      return Alert.alert('Ingresar un numero en cantidad')
    } else {
      newProduct.quantity = quantity
      const newProducts = stockProducts
      newProducts[i] = newProduct
      let subtotal = total
      let price = newProduct.price
      subtotal = (quantity*price)
      setStockProducts(newProducts)
    }

  }

  const Item = ({ product, i, typeList }) => {

    let showPrice = false
    let showQuantity = false
    let quantity = 0
    if (typeList == 'lastStock'){
      showPrice = true
      showQuantity = true
      quantity = product.quantity
    }
    if (typeList == 'register'){
      showPrice = true
    }
    const newProduct = stockProducts[i]
    return (

      <View style={[styles.viewSeccionColors, { flexDirection: 'row', width: '75%', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View style={{ flex: 1, marginLeft: 10, alignSelf: 'center' }}>
          <Text numberOfLines={2} style={[styles.titleSectionlist]}>{product.productName}</Text>
        </View>
        {(!showQuantity) && (
          <View>
            <TextInput
              style={[styles.input, { borderColor: '#aaa', marginLeft: 10, marginRight: 10 }]}
              placeholder="cantidad"
              onChangeText={(text) => handleSetQuantity(newProduct, i, text)}
            />
          </View>
        )}
        {(showQuantity) && (
          <View style={{ width: 40, height: 30, padding:5, orderWidth: 1, borderWidth: 1, borderColor: '#aaa', marginLeft: 10, marginRight: 10, justifyContent: 'center', }}>
            <Text style={{textAlign: 'center'}}>
              {quantity}
            </Text>
          </View>
        )}
        
        <View>
          {showPrice && (<Price product={product}/>)}
        </View>
      </View>
    )
  }


  const formatedLastStock = (list) => {
    for (let i = 0; i < lastStockProducts.length; i++) {
      list = list.concat(lastStockProducts[i].stockProducts);
    }
    return list
  }

  const formatTimestamp = (timestamp) => {

    let dateTime = timestamp.toDate();
    dateTime.setUTCHours(dateTime.getUTCHours() + 2);
    
    let date = new Date(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate()
    )
   
    const message = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    

    return message
  }
  const TitleDate = ({date}) => (
    <View style={styles.viewTitleDate}>
      <Text style={styleModal.titleDate}>Stock en el dia {date}</Text>
    </View>
  )

  
  const ProductsList = ({typeList}) => {
    
    let list = []
    if (typeList == 'products' || typeList == 'register'){
      list = products
    }
    if (typeList == 'lastStock'){
      list = lastStockProducts
    }

    if (list.length < 0) {
      return <Text>No hay productos</Text>
    }
    let timestamp = ''
    if (typeList == 'lastStock'){
      list = formatedLastStock(list)
      timestamp = list.shift()
      timestamp = timestamp.timestamp
      timestamp = formatTimestamp(timestamp)
      console.log('timestamp: '+timestamp);
    }

    return (

        <>
          {(timestamp) && (
            <TitleDate date = {timestamp} />
          )}

          {(list.map((product, i) => {
            return <Item product={product} typeList={typeList} i={i} key={i} />
          }))}
      </>

    )
  }

  const SectionDoControl = ({typeList}) => {

    return (
      <BlurView tint="dark" intensity={60} style={[styleModal.centeredView]}>
        <View style={styleModal.modalView}>
        <View style={{ marginTop: 50, marginBottom: 50 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ProductsList typeList={typeList} />
          <Text>Total: ${total}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30, marginBottom: 50 }}>
            <TouchableOpacity
              disabled={createBtnDisabled}
              style={[stylesStock.button, stylesStock.buttonClose, { marginTop: 10, marginRight: 30, backgroundColor: '#31a84f' }]}
              onPress={handleSaveBuy}>
              <Text style={stylesStock.textStyle}>Guardar compra</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[stylesStock.button, stylesStock.buttonClose, { marginTop: 10, backgroundColor: '#d33' }]}
              onPress={() => {setModalRegisterBuy(false)}}>
              <Text style={stylesStock.textStyle}>Cancelar</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
          </View>
        </View>
      </BlurView>
    )
  }


  //return StockScreen
  return (
    <View style={[styles.container]}>
      <ScrollView>
        <Text style={{ color: '#3e3944', fontSize: 32, fontWeight: '40', textAlign: 'center', marginTop: 20 }}>
            Silvia
        </Text>

        <View style={[styles.center]}>
            <WhatsAppIcon />
            <Text style={{ color: '#3e3944', fontSize: 32, fontWeight: '40', textAlign: 'center', marginLeft: 20 }}>
                +54 9 221 592-2902
            </Text>

        </View>

          {/* MODALS */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}>

          <View style={styleModal.centeredView}>
            <View style={styleModal.modalView}>
              <LastReceiptImg />
              <Pressable
                style={[styleModal.button, styleModal.buttonClose, { marginTop: 10 }]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styleModal.textStyle}>Ok</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalRegisterBuy}
          onRequestClose={() => {
            setModalRegisterBuy(false)
          }}>
          <SectionDoControl typeList={'register'} />
        </Modal>
          {/* MODALS */}



        
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30 }}>
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
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30, marginBottom: 50 }}>
          <Pressable
            style={[styleModal.button, styleModal.buttonControlStock]}
            onPress={() => {
              setModalRegisterBuy(true)
            }}>
            <Text style={styleModal.textStyle}>Registrar compra</Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  )

}
