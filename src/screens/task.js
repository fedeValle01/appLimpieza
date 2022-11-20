import React, {useEffect, useState} from 'react';
import { Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { doc, setDoc } from "firebase/firestore"; // Follow this pattern to import other Firebase services
import styles from '../screens/stylesScreens';
export default function Tareas({navigation}) {

    return(
    <SafeAreaView style = {styles.container}>
      <Text>Taks</Text>
    </SafeAreaView>
    )
  }