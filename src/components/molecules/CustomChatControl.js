import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomChatControl = ({onSend, onAttach, ...props}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => onAttach()}>
          <Icon style={styles.icon} name="plus" size={24} />
        </TouchableOpacity>
        <TextInput multiline {...props} style={styles.input} />
        <TouchableOpacity style={styles.button} onPress={() => onSend()}>
          <Text style={{color: 'white'}}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomChatControl;

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9999,
    backgroundColor: 'white',
  },
  controls: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'gray',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
    alignItems: 'center',
    paddingLeft: 8,
  },
  icon: {
    marginLeft: 0,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: 'blue',
    text: 'white',
    padding: 8,
    borderRadius: 8,
  },
});
