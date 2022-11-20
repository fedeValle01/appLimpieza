import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { doc, setDoc } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import styles from '../screens/stylesScreens';

export default function HomeScreen({navigation}) {

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
        <TouchableOpacity onPress={() => {navigation.navigate('Sectors', {email: email})}}>
          <Text>Ver sectores</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }