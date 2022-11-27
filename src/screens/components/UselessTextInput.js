import { TextInput, Text, SafeAreaView, StyleSheet } from "react-native";
import React, {useEffect, useState} from 'react';
const UselessTextInput = () => {
    const [task_name, onChangeTask] = useState("Nombre Tarea");
  
    return (
      <SafeAreaView>
        <Text style = {{textAlign: 'center'}} >Nombre Tarea</Text>
        <TextInput
          style={txtInput.input}
          onChangeText={onChangeTask}
          placeholder="Nombre Tarea"
          value={txtInput}
        />
      </SafeAreaView>
    );
  };export default UselessTextInput;

  const txtInput = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });