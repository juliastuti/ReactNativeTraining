import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

const CustomInput = ({label, isValid, validation, ...props}) => {
  return (
    <View style={styles.input_wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
      {!isValid && <Text style={styles.validation}>{validation}</Text>}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  input_wrapper: {marginBottom: 20},
  label: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderStyle: 'solid',
    color: 'black',
  },
  validation: {color: 'red', fontSize: 10},
  
});
