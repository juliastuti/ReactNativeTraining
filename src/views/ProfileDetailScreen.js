import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

const ProfileDetailScreen = ({route}) => {
  const {userId} = route.params;
  console.log(userId);

  return <SafeAreaView style={styles.container}></SafeAreaView>;
};

export default ProfileDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
