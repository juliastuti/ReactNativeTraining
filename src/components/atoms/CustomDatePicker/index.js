import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

const CustomDatePicker = ({label, date, setDate}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.input_wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TouchableWithoutFeedback onPress={() => setOpen(true)}>
        <View style={styles.border}>
          <Text>{date.toISOString().split('T')[0]}</Text>
          <Icon
            name="arrow-down-drop-circle-outline"
            size={20}
            color={'black'}
          />
        </View>
      </TouchableWithoutFeedback>
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default CustomDatePicker;

const styles = StyleSheet.create({
  input_wrapper: {marginBottom: 20, width: '100%'},
  label: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  border: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
