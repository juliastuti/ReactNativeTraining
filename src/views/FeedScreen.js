import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {FeedGrid} from '../components/molecules';

const FeedScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <FeedGrid />
    </SafeAreaView>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({});
