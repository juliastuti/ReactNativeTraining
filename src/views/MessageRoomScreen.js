import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {ProfileDetailScreen} from '.';
import {genderItems} from '../selectItems/SelectItem';

const MessageRoomScreen = ({route, navigation}) => {
  const {userId, name} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
    console.log(name);
  }, []);

  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default MessageRoomScreen;

const styles = StyleSheet.create({});
