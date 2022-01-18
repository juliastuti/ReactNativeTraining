import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AuthContext} from '../../context';
import getClient from '../../services/getClient';

const FeedGrid = () => {
  const [currentLoginTime, setCurentLoginTime] = useState(new Date());
  const [data, setData] = useState([]);
  const [nextLoginTime, setNextLoginTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, dispatch] = useContext(AuthContext);
  const navigation = useNavigation();

  const getUser = () => {
    setIsLoading(true);
    getClient('ProfileFeedCtrl/ProfileFeed', {
      params: {
        access_token: user.token,
        last_login_time: currentLoginTime,
      },
    }).then(res => {
      if (res.data.status === 1) {
        if (res.data.items.length > 0) {
          setIsLoading(false);
          setNextLoginTime(res.data.lastLoginTime);
          setData([...data, ...res.data.items]);
        } else if (res.data.items.length === 0) {
          setIsLoading(false);
          return;
        }
      }
    });
  };

  useEffect(() => {
    getUser();
  }, [currentLoginTime]);

  const renderItem = ({item}) => {
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            navigation.navigate('ProfileDetailScreen', {userId: item.userId})
          }>
          <Image
            style={styles.image}
            source={{
              uri: item.imageUrl
                ? item.imageUrl
                : 'https://via.placeholder.com/150?',
            }}
          />
          <Text style={styles.name}>{item.nickname}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="small"
          style={!isLoading && {display: 'none'}}
        />
      </View>
    );
  };

  const updateShown = () => {
    setCurentLoginTime(nextLoginTime);
  };

  return (
    <FlatList
      numColumns={2}
      data={data}
      ListFooterComponent={renderLoading}
      renderItem={renderItem}
      onEndReached={updateShown}
      onEndReachedThreshold={0.01}
      keyExtractor={(item, i) => i.toString()}
    />
  );
};

export default FeedGrid;

const styles = StyleSheet.create({
  grid: {flex: 1},
  wrapper: {
    flex: 1,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  name: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 8,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  loading: {
    padding: 8,
  },
});
