import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FeedScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>test icon</Text>
      <Icon name="feed" size={30} color="blue" />
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({});
