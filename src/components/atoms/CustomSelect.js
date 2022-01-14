import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomSelect = ({value, setValue, data, label, placeholder}) => {
  return (
    <View style={styles.input_wrapper}>
      <Icon
        name="arrow-down-drop-circle-outline"
        color={'black'}
        style={styles.pickerIcon}
      />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.border}>
        <Picker
          // mode="dropdown"
          selectedValue={value}
          // defaultNull={setValue === null}
          hideIcon
          onValueChange={(itemValue, itemIndex) => setValue(itemValue)}>
          {data ? (
            data.map((item, i) => {
              return (
                <Picker.Item
                  style={styles.pickerContent}
                  key={i}
                  label={item.label}
                  value={item.value}
                />
              );
            })
          ) : (
            <Picker.Item label="Unknown" value="" />
          )}
        </Picker>
      </View>
    </View>
  );
};

export default CustomSelect;

const styles = StyleSheet.create({
  input_wrapper: {marginBottom: 20},
  label: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  border: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginRight: -100,
    marginLeft: -15,
  },
  picker: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderStyle: 'solid',
  },
  pickerIcon: {
    position: 'absolute',
    bottom: 15,
    right: 0,
    fontSize: 20,
  },
  pickerContent: {
    fontSize: 14,
    width: '50%',
    // backgroundColor: 'transparent',
  },
});
