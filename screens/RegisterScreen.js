import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import { Text } from 'react-native-paper'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import { doc, setDoc, getFirestore } from "firebase/firestore"
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebase-config';


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [user, setUser] = useState(null);

  const createUser = async (uid) =>{
    await setDoc(doc(db, 'user', uid), {
      username: name.value,
      uid: uid,
    });
  }


  const handleCreateAccount = async () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }else{
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((UserCredential) =>{
      console.log('Cuenta con email '+email.value+ 'creada ');
      setUser(user);
      let uid = UserCredential.user.uid;
      createUser(uid);
      navigation.navigate('appLimpieza', {uid: uid, uidTask: uid})
    })
    .catch(error => {
      alert(error);
    })
    }
    
  }


  return (
    <SafeAreaView style = {styles.container}>
      <View style = {styles.container}>
        <Logo />
        <Header>Crear cuenta</Header>
        <View style = {{width: 300}}>
          <TextInput
            label="Nombre"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: '' })}
            error={!!name.error}
            errorText={name.error}
          />
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Contraseña"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
        </View>
        <Button
          mode="contained"
          onPress={handleCreateAccount}
          style={{ marginTop: 24 }}
        >
          <Text>Registrarte</Text>
        </Button>
        <View >
          <Text>Ya tenes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.replace('Iniciar Sesion')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#cdcdcd',
    alignItems: 'center',
    justifyContent: 'center',
  },    
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
