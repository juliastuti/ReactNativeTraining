import {StyleSheet, Text, View, FlatList} from 'react-native';
import React from 'react';

const MessageFeed = ({...rest}) => {
  return <FlatList {...rest} />;
};

export default MessageFeed;

const styles = StyleSheet.create({});
