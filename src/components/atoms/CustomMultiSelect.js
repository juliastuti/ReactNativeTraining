import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

const CustomMultiSelect = ({items, selected, setSelected, title, ...rest}) => {
  const [isOpen, setIsOpen] = useState(false);

  const labelArr = items.map(item => {
    return item.label;
  });

  const labels = selected.map(item => {
    return ` ${labelArr[item]}`;
  });

  const removeItem = val => {
    const newItem = selected.filter(item => item != val);
    setSelected(newItem);
  };

  return (
    <View style={styles.input_wrapper}>
      <Text style={styles.label}>{title}</Text>
      <TouchableWithoutFeedback onPress={() => setIsOpen(!isOpen)}>
        <View
          style={{
            position: 'relative',
          }}>
          {isOpen ? (
            <Icon
              name="arrow-up-drop-circle-outline"
              color={'black'}
              style={{position: 'absolute', top: '30%', right: 0, fontSize: 20}}
            />
          ) : (
            <Icon
              name="arrow-down-drop-circle-outline"
              color={'black'}
              style={{position: 'absolute', top: '30%', right: 0, fontSize: 20}}
            />
          )}
          <TextInput
            value={items ? labels.toString() : 'Items is empty'}
            editable={false}
            style={styles.input}
            {...rest}
          />
        </View>
      </TouchableWithoutFeedback>
      {items &&
        items.map((item, i) => {
          return (
            <View key={i}>
              {isOpen && (
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (!selected.includes(item.value)) {
                      setSelected([...selected, item.value]);
                    } else {
                      removeItem(item.value);
                    }
                  }}>
                  <View
                    style={[
                      styles.option_wrapper,
                      selected.includes(item.value)
                        ? {backgroundColor: '#F7F7F7'}
                        : {backgroundColor: 'white'},
                    ]}>
                    <Text
                      style={[
                        selected.includes(item.value)
                          ? {color: 'gray'}
                          : {color: 'black'},
                      ]}>
                      {item.label}
                    </Text>
                    {selected.includes(item.value) && (
                      <Icon
                        style={{fontSize: 20}}
                        name="check"
                        color="gray"
                        onPress={() => removeItem(item.value)}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          );
        })}
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
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderStyle: 'solid',
    color: 'black',
  },
  option_wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
});
