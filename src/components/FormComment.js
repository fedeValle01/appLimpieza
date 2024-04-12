import { TextInput, TouchableOpacity, Text, SafeAreaView, StyleSheet, Alert, View } from "react-native";
import React, {useEffect, useState} from 'react';
import stylesStock from "../screens/stock/stylesStock";
import firebaseConfig from "../firebase-config";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

const FormComment = ({uid, closeModal}) => {

    const [comment, setComment] = useState("");
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);


    const AreYouSureLeaveComment = () => {
      return Alert.alert("Esto se guardará en el historial.", "Esta seguro?", [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: handleLeaveComment },
      ]);
    }

    const handleLeaveComment = async() => {
      let ref = doc(db, "assigned_tasks", uid);
      await updateDoc(ref, {
        comment: comment,
      }).then(()=> {
          return(Alert.alert('Se realizó la observación con exito!'))
      })
    };

    return (
      <SafeAreaView style={styles.container}>
        <Text style = {{textAlign: 'center'}}>Observación</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setComment(text)}
          placeholder="ej. Limpió tarde pero avisó con antelación"
          numberOfLines={6}
          value={comment}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 50, marginBottom: 50 }}>
          <TouchableOpacity
            style={[stylesStock.button, stylesStock.buttonClose, { marginTop: 10, marginRight: 30, backgroundColor: '#31a84f' }]}
            onPress={AreYouSureLeaveComment}>
            <Text style={stylesStock.textStyle}>Guardar observación</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[stylesStock.button, stylesStock.buttonClose, { marginTop: 10, backgroundColor: '#d33' }]}
            onPress={closeModal}>
            <Text style={stylesStock.textStyle}>Cancelar</Text>
          </TouchableOpacity>
        </View>
        
      </SafeAreaView>
    )
  };export default FormComment;

  const styles = StyleSheet.create({
    input: {
      height: 190,
      margin: 12,
      borderWidth: 2,
      borderColor: "#eee",
      padding: 10,
      width: 230,
      alignContent: 'flex-start',
      textAlignVertical: 'top'
    },
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    }
  });