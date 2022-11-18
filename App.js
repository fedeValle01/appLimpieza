import React, {useEffect, useState, Component} from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, signInWithCustomToken, AuthCredential, getIdToken} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, query, querySnapshot, getDocs, orderBy, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import firebaseConfig from './firebase-config';



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);




function ListItem(props) {
  return(
    <SafeAreaView>
    <Text>{props.value}</Text>
    </SafeAreaView>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  return (
    <Text>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </Text>
  );
}



//----------consolelogsectors--------
// getDocs(collection(db, "sectors")).then(docSnap => {
//   docSnap.forEach((doc)=> {
//     sectors.push({ ...doc.data(), id:doc.id })
    
//   });
  
//       const listSectors = sectors.map((sector,i) =>{
//         console.log("Sector "+i+': ',sector.sector_name);
//         console.log("listSectors: ",listSectors);
//         console.log("sectors: ",sectors);
//       }    
// );

// });


const SectorList = (props) => {
  const sectors = props.sectors;
  let arregloNombres = [];
  if(sectors!=""){
    sectors.forEach((sector, i) => {
      arregloNombres[i] = sector.sector_name;
      console.log('arregloNombres['+i+'] : ',arregloNombres[i] );
    });

    return (
      <Text>
        {arregloNombres.map((nombre) =>
          <ListItem key={nombre.toString()}
                    value={nombre} />
        )}
      </Text>
    );
  }else{
    console.log('no hay sectores');
  }
  
}

//-------SCREEN SECTORS-----------

function Sectors({navigation}) {

 


  const [sectorNames, setSectorName] = useState([]);
  const numbers = [1, 2, 3, 4, 5];
  const [sectors, setSectors ] = useState([]);
  
  console.log('1 o 2?');


  useEffect(() =>{
    const collectionRef = collection(db, 'sectors');
    const q = query(collectionRef, orderBy('sector_name', 'asc'))

    const unsuscribe = onSnapshot(q, querySnapshot =>{
      setSectors(
        querySnapshot.docs.map(doc =>({
          sector_name: doc.data().sector_name,
          sector_description: doc.data().sector_description,
        }))
      )
    })
    return unsuscribe;
  }, [])


  
  

    return (
      
      <SafeAreaView style = {styles.container}>
        <Text>Sectores screen</Text>
        <NumberList numbers = {numbers}/>
        {/* {sectors.map(sector =><SectorComp key={sector.sector_name} {...sector} />)} */}

        
        <TouchableOpacity onPress = {()=> {console.log('sectorNames: ', sectorNames)} } >
          <Text>Ver sectorNames</Text>
        </TouchableOpacity>

        <SectorList sectors = {sectors}/>
      </SafeAreaView>
    )
  }





//---------HOME SCREEN------------

function HomeScreen({navigation}) {

  const [sector, setSector] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateSector = async () => {
    console.log('Sector: '+ sector);
    console.log('Sector description : '+ description);

    // Add a new document in collection "sectors"
    // Get a list of sectors from your database
    await setDoc(doc(db, 'sectors', sector), {
      sector_name: sector,
      sector_description: description
    });
  }


  return (
    <SafeAreaView style = {styles.container}>
      <Text>Nombre sector</Text>
      <TextInput placeholder='Nombre sector' onChangeText={(text) => setSector(text)}></TextInput>
      <Text>Descripcion sector</Text>
      <TextInput placeholder='Descripcion' onChangeText={(text) => setDescription(text)}></TextInput>

      <TouchableOpacity onPress={handleCreateSector}>
        <Text>Crear sector</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {navigation.navigate('Sectors')}}>
        <Text>Ver sectores</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

  


function LoginScreen({navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [UserCredential, setUserCredential] = useState('');
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  

  const handeCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then((UserCredential) =>{
      console.log('Cuenta con email '+email+ 'creada ');
      setUser(user);
      setUserCredential(UserCredential);
    })
    .catch(error => {
      alert(error);
      
    })
  }
  const handeSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((UserCredential) =>{
      console.log('Ingresado');
      console.log(user);
      setUser(user);
      setUserCredential(UserCredential);
      console.log('UserCredential: '+UserCredential+ ' user: '+user);
      navigation.navigate("Home");
    })
    .catch(error => {
      alert(error);
    })
  }
  const helloAlert = () => {
      alert("Hello World!");
  }
  const viewCred = () => {
    alert("Cred: "+ auth);
  }

const logInWithCred = async () => {
  signInWithEmailAndPassword(auth, email, password)
    .then((UserCredential) =>{
      console.log('Ingresado');
      console.log(user);
      setUser(user);
      setUserCredential(UserCredential);
      console.log('UserCredential: '+UserCredential+ ' user: '+user);
      navigation.navigate("Home");
    })
    .catch(error => {
      alert(error);
    })

  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(function(idToken) {  // <------ Check this line
          //  console.log(idToken); It shows the Firebase token now
           

           //no anda :(
          //  signInWithCustomToken(auth, idToken)
          //     .then((idToken) =>{
          //       console.log('Ingresado por credencial');
          //       navigation.navigate("Home");
          //     })
          //     .catch(error => {
          //       alert(error);
          //     })
        });
    }
        console.log("ya tienes sesión iniciada con:", user.email+ ' cred: '+ UserCredential);
        setEmail(user.email);
        setPassword(user.password);
      //   signInWithCustomToken(user.getIdToken()).then(() => {
      //   console.log('ingreso por token');
      //   navigation.navigate("Home");
      // })
      
    });
  }, []);

  return (
    
    <SafeAreaView style = {styles.container}>
      <Text>Login Screen</Text>
      <Text style={{color: "red"}}>E-mail</Text>
      <TextInput placeholder='emailc' onChangeText = {(text) => setEmail(text)}></TextInput>
      <Text style={{color: "red"}}>Password</Text>
      
      <TextInput placeholder='Password' secureTextEntry={true} onChangeText = {(text) => setPassword(text)}></TextInput>
      

      <TouchableOpacity onPress={handeSignIn}>
        <Text>Ingresar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handeCreateAccount}>
        <Text>Crear cuenta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={helloAlert}>
        <Text>Alerta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={viewCred}>
        <Text>viewCred</Text>
      </TouchableOpacity>  
      <TouchableOpacity onPress={logInWithCred}>
        <Text>logInWithCred</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {navigation.navigate('Sectors')}}>
        <Text>Ver sectores</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const Stack = createNativeStackNavigator();

export default function App() {
  

  return (
    <NavigationContainer>
         <Stack.Navigator>
            <Stack.Screen name = "Login" component = {LoginScreen}/>
            <Stack.Screen name = "Home" component = {HomeScreen}/>
            <Stack.Screen name = "Sectors" component = {Sectors}/>
         </Stack.Navigator>
            
          
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
