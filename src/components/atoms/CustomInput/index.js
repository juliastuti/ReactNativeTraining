import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

// const CustomInput = () => {
//   return (
//     <SafeAreaView>
//       <TextInput
//         style={styles.input}
//         onChangeText={onChangeText}
//         value={text}
//       />
//       <TextInput
//         style={styles.input}
//         onChangeText={onChangeText}
//         value={number}
//         keyboardType="numeric"
//       />
//     </SafeAreaView>
//   );
// };

const CustomInput = ({...props, type}) => {
  return (      
          <TextInput
            style={styles.input}
            {...props}
            keyboardType={type === "number" ? "numeric" : "text"}
          />
      );
    }; 

export default CustomInput;

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  input_wrapper: {marginBottom: 4},
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderStyle: 'solid',
    color: 'black',
  },
  validation: {color: 'red', fontSize: 10},
  hidden: {display: 'none'},
  button: {
    backgroundColor: '#1644BD',
    padding: 12,
    marginBottom: 16,
    marginTop: 16,
  },
});
