import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const CustomButton = ({title, theme, color, ...props}) => {
  return (
    <TouchableOpacity
      {...props}
      style={
        theme == 'outline-primary'
          ? styles.outlinePrimary
          : theme == 'primary'
          ? styles.primary
          : theme == 'outline-danger'
          ? styles.outlineDanger
          : styles.danger
      }>
      <Text
        style={
          theme == 'outline-primary'
            ? styles.textOutlinePrimary
            : theme == 'outline-danger'
            ? styles.textOutlineDanger
            : styles.text
        }>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  outlinePrimary: {
    borderColor: '#1644BD',
    borderWidth: 1,
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  primary: {
    borderColor: '#1644BD',
    backgroundColor: '#1644BD',
    borderWidth: 1,
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  outlineDanger: {
    borderColor: '#BB1C2A',
    borderWidth: 1,
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  danger: {
    borderColor: 'transparent',
    backgroundColor: '#BB1C2A',
    borderWidth: 1,
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  textOutlinePrimary: {
    color: '#1644BD',
    textAlign: 'center',
    fontWeight: '800',
  },
  textOutlineDanger: {
    color: '#BB1C2A',
    textAlign: 'center',
    fontWeight: '800',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
  },
});
