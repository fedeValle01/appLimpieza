import React, { useEffect } from 'react'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import { SafeAreaView, Text, View } from 'react-native';
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebase-config';
import styles from '../screens/stylesScreens';


  
export default function StartScreen({ navigation }) {


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('appLimpieza', {uid: user.uid, uidTask: user.uid})
    }
        
    });
    
  }, []);

  return (
    <SafeAreaView style = {styles.container}>
      <View style = {styles.container}>
        <Logo />
        <Header>appLimpieza</Header>
        <Paragraph>
          Iniciar sesion o registrar usuario
        </Paragraph>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Iniciar Sesion')}
        >
          <Text>Iniciar sesion</Text> 
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Registrarte')}
        >
          <Text>Registrarte</Text> 
        </Button>
      </View>
    </SafeAreaView>
  )
}
