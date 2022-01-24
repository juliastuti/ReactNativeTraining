import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';

const MessageFeed = ({...rest}) => {
  return <FlatList {...rest} />;
};

export default MessageFeed;

const styles = StyleSheet.create({});
