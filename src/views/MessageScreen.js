import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/core';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {MessageFeed} from '../components/molecules';
import {AuthContext} from '../context';
import getClient from '../services/getClient';
import {CustomButton} from '../components/atoms';
import {CheckBox} from 'react-native-elements';

const MessageScreen = ({navigation}) => {
  const [user] = useContext(AuthContext);
  const [message, setMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [talkId, setTalkId] = useState([]);
  const [isRefreshed, setIsRefreshed] = useState(false);

  const renderItem = ({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (!toggle) {
            navigation.navigate('MessageRoomScreen', {
              userId: item.toUserId,
              name: item.nickname,
              imgUrl: item.imageUrl,
            });
          }
        }}>
        <View style={styles.wrapper}>
          {toggle && (
            <View style={{paddingRight: 8}}>
              <CheckBox
                center
                checkedIcon={
                  <Icon name="checkbox-marked" color="blue" size={18} />
                }
                uncheckedIcon={
                  <Icon name="checkbox-blank-outline" color="blue" size={18} />
                }
                checked={talkId.includes(item.talkId)}
                onPress={() => {
                  const newIds = [...talkId];
                  const index = newIds.indexOf(item.talkId);

                  if (index > -1) {
                    newIds.splice(index, 1);
                  } else {
                    newIds.push(item.talkId);
                  }
                  setTalkId(newIds);
                }}
              />
            </View>
          )}

          <Image
            source={{
              uri: item.imageUrl
                ? item.imageUrl
                : 'https://via.placeholder.com/150',
            }}
            style={styles.image}
          />
          <View style={styles.identityWrapper}>
            <Text style={styles.name}>{item.nickname}</Text>
            <Text style={styles.message} numberOfLines={1}>
              {item.mediaType === 0
                ? item.message
                : item.mediaType === 1
                ? 'Image'
                : 'Video'}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
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

  const handleHeader = () => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          {message.length !== 0 && (
            <View>
              {!toggle ? (
                <TouchableWithoutFeedback onPress={() => setToggle(true)}>
                  <Text
                    style={{
                      paddingRight: 16,
                      color: '#1644BD',
                      fontWeight: 'bold',
                    }}>
                    Edit
                  </Text>
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback
                  onPress={() => {
                    setToggle(false);
                    setTalkId([]);
                  }}>
                  <Text
                    style={{
                      paddingRight: 16,
                      color: '#1644BD',
                      fontWeight: 'bold',
                    }}>
                    Cancel
                  </Text>
                </TouchableWithoutFeedback>
              )}
            </View>
          )}
        </View>
      ),
    });
  };

  useEffect(() => {
    handleHeader();
  }, [toggle, message]);

  const getMessage = () => {
    setIsLoading(true);
    getClient
      .get('TalkCtrl/TalkList', {
        params: {
          access_token: user.token,
        },
      })
      .then(res => {
        if (res.data.status === 1) {
          setMessage([...res.data.items]);
        } else {
          alert('No Message');
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshed(false);
      });
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      getMessage();
      setToggle(false);
      setTalkId([]);
    });
  }, [navigation]);

  const handleRefreshed = () => {
    setIsRefreshed(true);
    getMessage();
  };

  const handleDelete = () => {
    setIsLoading(true);
    getClient
      .get('TalkCtrl/Delete', {
        params: {
          access_token: user.token,
          talk_ids: talkId.toString(),
        },
      })
      .then(res => {
        if (res.data.status === 1) {
          let newMessage = message.filter(item => {
            return item.talkId != talkId;
          });
          setMessage(newMessage);
          getMessage();
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setToggle(false);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 16}}>
        <MessageFeed
          data={message}
          renderItem={renderItem}
          refreshing={isRefreshed}
          onRefresh={handleRefreshed}
          keyExtractor={(item, i) => i.toString()}
        />
      </View>
      {toggle && (
        <View style={styles.buttonWrapper}>
          <View style={styles.button}>
            <CustomButton
              theme="danger"
              title="Delete"
              onPress={() => handleDelete()}
              disabled={talkId.length === 0 ? true : false}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {position: 'relative', flex: 1},
  wrapper: {
    flexDirection: 'row',
    borderBottomColor: '#d7d7d7',
    borderBottomWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  image: {borderRadius: 100, height: 60, width: 60},
  identityWrapper: {paddingLeft: 16, flex: 1},
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  message: {color: 'black'},
  buttonWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
  },
});
