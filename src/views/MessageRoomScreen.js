import {
  FlatList,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {CustomChatControl, Popup} from '../components/molecules';
import {AuthContext} from '../context';
import axios from 'axios';
import getClient from '../services/getClient';
import {CustomButton} from '../components/atoms';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const MessageRoomScreen = ({route, navigation}) => {
  const {userId, name, imgUrl} = route.params;
  const [user] = useContext(AuthContext);
  const [talk, setTalk] = useState([]);
  const [typeTalk, setTypeTalk] = useState('');
  const [popup, setPopup] = useState(false);
  const [add, setAdd] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'App Storage Permission',
          message: 'App needs access to your storage ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission given');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleGetTalk = () => {
    getClient
      .get('TalkCtrl/Talk', {
        params: {
          access_token: user.token,
          to_user_id: userId,
          border_message_id: 0,
          how_to_request: 0,
        },
      })
      .then(result => {
        if (result.data.status === 1) {
          setTalk(result.data.items);
          setAdd(false);
        }
      });
  };

  console.log(user.token, userId);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PhotoViewerScreen', {
                  imgUrl,
                })
              }>
              <Image
                style={{width: 40, height: 40, borderRadius: 100}}
                source={{uri: imgUrl}}
              />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 12,
                fontSize: 18,
                fontWeight: 'bold',
                color: 'black',
                textTransform: 'capitalize',
              }}>
              {name}
            </Text>
          </>
        );
      },
    });
    handleGetTalk();
  }, [add]);

  const handleUploadImage = image => {
    console.log('Request Data Image Upload', {
      access_token: user.token,
      image: image,
      location: 'Profile',
    });
    const url = 'MediaCtrl/ImageUpload';
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': 82,
    };
    const data = new FormData();
    data.append('data', {
      uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
      name: image.fileName,
      type: image.type,
    });

    getClient
      .post(url, data, {
        params: {
          access_token: user.token,
          location: 'Profile',
        },
        headers: headers,
      })
      .then(res => {
        if (res.data.status === 1) {
          handleGetProfile();
          setPopup(!popup);
        }
      });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, res => {
      console.log(res);
      if (res.assets) {
        handleUploadImage(res.assets[0]);
      }
    });
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    const storagePermission = requestGalleryPermission();

    const cameraPermission = requestCameraPermission();
    if (cameraPermission && storagePermission) {
      launchCamera(options, res => {
        console.log(res);
        if (res.assets) {
          handleUploadImage(res.assets[0]);
        }
      });
    }
  };

  const handleSendMessage = () => {
    const fd = new FormData();
    fd.append('message', typeTalk);
    getClient
      .post('TalkCtrl/SendMessage', fd, {
        params: {
          access_token: user.token,
          to_user_id: userId,
        },
      })
      .then(res => {
        if (res.data.status === 1) {
          setTypeTalk('');
          setAdd(true);
          alert(res.data.status);
        }
      });
  };
  return (
    <View style={styles.wrapper}>
      {popup && (
        <Popup popup={popup} setPopup={setPopup}>
          <>
            <CustomButton
              theme="outline-primary"
              title="Gallery"
              onPress={() => openGallery()}
            />
            <CustomButton
              theme="outline-primary"
              title="Camera"
              onPress={() => openCamera()}
            />
          </>
        </Popup>
      )}
      <FlatList
        extraData={talk}
        data={talk}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({item, i}) => {
          const date = new Date(item.time.substring(0, 19));
          const newDate = `${date.getHours()}.${date.getMinutes()}`;
          console.log(newDate);
          return (
            <View style={styles.messageList}>
              {item.imageUrl && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PhotoViewerScreen', {
                      imgUrl: item.imageUrl,
                    })
                  }>
                  <View
                    style={[
                      {
                        padding: 8,
                        width: 200,
                        height: 200,
                        marginVertical: 8,
                        borderRadius: 8,
                      },
                      item.messageKind === 1
                        ? {backgroundColor: 'blue'}
                        : {backgroundColor: 'green'},
                    ]}>
                    <Image style={{flex: 1}} source={{uri: item.imageUrl}} />
                  </View>
                </TouchableOpacity>
              )}

              <View
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                  },
                  item.messageKind === 1
                    ? {justifyContent: 'flex-end'}
                    : {justifyContent: 'flex-start'},
                ]}>
                {item.messageKind === 1 && (
                  <Text
                    style={{
                      marginBottom: 8,
                      marginRight: 8,
                      fontSize: 12,
                      fontWeight: '700',
                    }}>
                    {item.time}
                  </Text>
                )}
                <Text
                  style={[
                    styles.inboxText,
                    item.messageKind === 1
                      ? {backgroundColor: 'green', justifyContent: 'flex-end'}
                      : {backgroundColor: 'blue', justifyContent: 'flex-start'},
                  ]}>
                  {item.message}
                </Text>
                {item.messageKind === 2 && (
                  <Text
                    style={{
                      marginBottom: 8,
                      marginLeft: 8,
                      fontSize: 12,
                      fontWeight: '700',
                    }}>
                    {newDate}
                  </Text>
                )}
              </View>
            </View>
          );
        }}
      />
      <CustomChatControl
        value={typeTalk}
        onChangeText={text => setTypeTalk(text)}
        onSend={handleSendMessage}
        onAttach={() => setPopup(!popup)}
      />
    </View>
  );
};

export default MessageRoomScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  messageList: {
    paddingHorizontal: 16,
  },
  inboxText: {
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginVertical: 8,
    maxWidth: 200,
  },
});
