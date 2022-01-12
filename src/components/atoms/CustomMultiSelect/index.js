import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomMultiSelect = ({label, value, items, setValue}) => {
  const onSelectedItemsChange = selectedItems => {
    setValue(selectedItems);
  };

  return (
    <View style={styles.input_wrapper}>
      <Icon
        name="arrow-down-drop-circle-outline"
        color={'black'}
        style={styles.pickerIcon}
      />
      <View style={styles.border}>
        <Text style={styles.label}>{label}</Text>
        <MultiSelect
          fixedHeight
          items={items ? items : [{id: 1, name: 'unknown'}]}
          uniqueKey="id"
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={value}
          selectText="Hobby"
          onChangeInput={text => console.log(text)}
          backgroundColor="transparent"
          tagRemoveIconColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#000"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          hideSubmitButton
          hideDropdown
        />
      </View>
    </View>
  );
};

export default CustomMultiSelect;

const styles = StyleSheet.create({
  input_wrapper: {marginBottom: 20, width: '100%'},
  label: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  border: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  pickerIcon: {
    position: 'absolute',
    bottom: 15,
    right: 10,
    fontSize: 16,
  },
});
