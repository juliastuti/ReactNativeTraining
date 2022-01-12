import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CustomDatePicker} from '../components/atoms';

const FeedScreen = () => {
  const [date, setDate] = useState(new Date());

  return <CustomDatePicker date={date} onDateChange={setDate} />;
};

export default FeedScreen;

const styles = StyleSheet.create({});
