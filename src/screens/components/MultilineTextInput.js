import React, {useEffect, useState} from 'react';
import { TextInput, Text, SafeAreaView, StyleSheet } from 'react-native';

const UselessTextInput = (props) => {
  return (
    <TextInput
      {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
      editable
      multiline
      maxLength={200}
    />
  );
}

const UselessTextInputMultiline = () => {
  const [task_description, onChangeText] = useState('');

  // If you type something in the text box that is a color, the background will change to that
  // color.
  return (
    <SafeAreaView>
        <Text style = {{textAlign: 'center'}} >Descripción</Text>
      <UselessTextInput
        multiline
        numberOfLines={4}
        onChangeText={text => onChangeText(text)}
        placeholder={'Descripción'}
        style={txtInput.input}
      />
    </SafeAreaView>
  );
}

export default UselessTextInputMultiline;

const txtInput = StyleSheet.create({
    input: {
      height: 150,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: 150,
      alignContent: 'flex-start',
      textAlignVertical: 'top'
    },
  });