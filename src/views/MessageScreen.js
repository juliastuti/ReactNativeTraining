import React, {useContext, useEffect, useState} from 'react';
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
import {Checkbox} from 'react-native-paper';

const MessageScreen = ({navigation}) => {
  const [user] = useContext(AuthContext);
  const [message, setMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [checked, setChecked] = useState(false);
  const [messageId, setMessageId] = useState(null);

  console.log(message);

  const renderItem = ({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate('MessageRoomScreen', {
            userId: item.userId,
            name: item.nickname,
          })
        }>
        <View style={styles.wrapper}>
          {toggle && (
            <View style={{paddingRight: 8}}>
              <Checkbox
                color="blue"
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked);
                  setMessageId(item.talkId);
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
              {item.message}
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

  useEffect(() => {
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
                <TouchableWithoutFeedback onPress={() => setToggle(false)}>
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
          console.log(res.data.items);
          setMessage([...res.data.items]);
          setIsLoading(false);
        } else if (res.data.error.errorCode === 2) {
          alert('No Message');
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      getMessage();
    });
  }, [navigation]);

  const handleDelete = () => {
    console.log('access_token', user.token, 'talk_ids', messageId);
    getClient
      .get('TalkCtrl/Delete', {
        params: {
          access_token: user.token,
          talk_ids: messageId,
        },
      })
      .then(res => {
        if (res.data.status === 1) {
          const newMessage = message.filter((item, i) => {
            return item.talkId !== messageId;
          });
          setMessage(newMessage);
          setToggle(false);
          getMessage();
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 16}}>
        <MessageFeed
          extraData={message}
          data={message}
          ListFooterComponent={renderLoading}
          renderItem={renderItem}
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
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {position: 'relative', flex: 1, backgroundColor: '#FFFF'},
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
