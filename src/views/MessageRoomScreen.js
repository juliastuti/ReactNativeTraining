import {
  FlatList,
  Image,
  Keyboard,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useContext, useState, useRef} from 'react';
import {CustomChatControl, Popup} from '../components/molecules';
import {AuthContext} from '../context';
import getClient from '../services/getClient';
import {CustomButton} from '../components/atoms';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';

const MessageRoomScreen = ({route, navigation}) => {
  const {userId, name, imgUrl} = route.params;
  const [user] = useContext(AuthContext);

  const [talk, setTalk] = useState([]);
  const [typeTalk, setTypeTalk] = useState('');
  const [popup, setPopup] = useState(false);
  const [add, setAdd] = useState(false);
  const [toggleCamera, setToggleCamera] = useState(false);
  const [borderMessageId, setBorderMessageId] = useState(0);
  const [howToRequest, setHowToRequest] = useState(0);
  const [msgDay, setMsgDay] = useState([]);

  const talkRef = useRef(true);
  const isMounted = useRef(false);

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

  // console.log(user, userId);

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

  const getTalk = async (
    access_token,
    to_user_id,
    border_message_id,
    how_to_request,
  ) => {
    const talks = await getClient.get('TalkCtrl/Talk', {
      params: {
        access_token,
        to_user_id,
        border_message_id,
        how_to_request,
      },
    });

    return talks.data;
  };

  const handleGetTalk = async () => {
    const data = await getTalk(
      user.token,
      userId,
      borderMessageId,
      howToRequest,
    );
    if (data.status === 0) {
      setAdd(false);
    } else {
      if (data.items) {
        const talks = data.items.reverse();
        if (borderMessageId === 0) {
          setTalk(talks);
          setBorderMessageId(talks[talks.length - 1].messageId);
          setHowToRequest(1);
        } else {
          if (talks === null) {
            setAdd(false);
          } else {
            setTalk([...talk, ...talks]);
            setBorderMessageId(talks[talks.length - 1].messageId);
          }
        }
      }
    }
  };

  const handleHeader = () => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <>
            {imgUrl && (
              <TouchableOpacity
                style={{
                  marginRight: 12,
                }}
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
            )}
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: 'black',
                textTransform: 'capitalize',
              }}>
              {name}
            </Text>
          </>
        );
      },
    });
  };

  useEffect(() => {
    handleGetTalk();
    handleHeader();
    isMounted.current = true;
    talkRef.current.scrollToEnd({animating: true});
  }, []);

  const openGallery = () => {
    const options = {
      mediaType: 'mixed',
      quality: 1,
    };

    launchImageLibrary(options, res => {
      if (res.assets) {
        console.log(res.assets[0]);
        handleSendMedia(res.assets[0]);
      }
    });
  };

  const openCamera = () => {
    const options = {
      mediaType: 'image',
      quality: 1,
    };

    const storagePermission = requestGalleryPermission();

    const cameraPermission = requestCameraPermission();
    if (cameraPermission && storagePermission) {
      launchCamera(options, res => {
        if (res.assets) {
          console.log(res.assets[0]);
          handleSendMedia(res.assets[0]);
        }
      });
    }
  };

  const openCameraVideo = () => {
    const options = {
      mediaType: 'video',
      quality: 1,
    };

    const storagePermission = requestGalleryPermission();

    const cameraPermission = requestCameraPermission();
    if (cameraPermission && storagePermission) {
      launchCamera(options, res => {
        if (res.assets) {
          console.log(res.assets[0]);
          handleSendMedia(res.assets[0]);
        }
      });
    }
  };

  const handleNewTalk = async () => {
    const data = await getTalk(user.token, userId, 0, 0);
    if (data.status === 1) {
      const talks = data.items.reverse().map((item, i) => {
        const days = item.time.substring(0, 10);
        if (msgDay.includes(days)) {
          return Object.assign(item, {day: null});
        } else {
          setMsgDay([...msgDay, days]);
          return Object.assign(item, {day: null});
        }
      });

      setTalk(talks);
      setBorderMessageId(talks[talks.length - 1].messageId);
      setHowToRequest(1);
      setPopup(false);
      if (talks === null) {
        setAdd(false);
      }
      setTypeTalk('');
      talkRef.current.scrollToEnd({animating: true});
    }
  };

  const handleSendMessage = async () => {
    const fd = new FormData();
    fd.append('message', typeTalk);
    const sendTalkData = await getClient.post('TalkCtrl/SendMessage', fd, {
      params: {
        access_token: user.token,
        to_user_id: userId,
      },
    });

    if (sendTalkData.data.status === 1) {
      setAdd(true);
      handleNewTalk();
      Keyboard.dismiss();
    }
  };

  const handleSendMedia = media => {
    const url = `MediaCtrl/${media.bitrate ? 'VideoUpload' : 'ImageUpload'}`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': 82,
    };
    const data = new FormData();

    data.append('data', {
      uri: Platform.OS === 'ios' ? media.uri.replace('file://', '') : media.uri,
      name: media.fileName,
      type: media.type,
    });

    getClient
      .post(url, data, {
        params: {
          access_token: user.token,
          location: 'Talk',
        },
        headers: headers,
      })
      .then(res => {
        console.log('response', res.data);
        if (res.data.status === 1) {
          let params;
          if (res.data.videoId) {
            params = {
              access_token: user.token,
              to_user_id: userId,
              video_id: res.data.videoId,
            };
          } else {
            params = {
              access_token: user.token,
              to_user_id: userId,
              image_id: res.data.imageId,
            };
          }
          getClient
            .get('TalkCtrl/SendMessage', {
              params,
            })
            .then(result => {
              console.log(result.data);
              if (result.data.status === 1) {
                setAdd(true);
                handleNewTalk();
              }
            })
            .catch(err => console.log(err));
        } else {
          alert(res.data.error.errorMessage);
          setPopup(false);
        }
      })
      .catch(err => console.log(err));
  };

  const dateFormatter = dates => {
    const date = new Date(dates);
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <View style={styles.wrapper}>
      {popup && (
        <Popup
          popup={popup}
          setToggleCamera={setToggleCamera}
          setPopup={setPopup}>
          <>
            {!toggleCamera && (
              <>
                <CustomButton
                  theme="outline-primary"
                  title="Gallery"
                  onPress={() => openGallery()}
                />
                <CustomButton
                  theme="outline-primary"
                  title="Camera"
                  onPress={() => setToggleCamera(true)}
                />
              </>
            )}

            {toggleCamera && (
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, marginRight: 8}}>
                  <CustomButton
                    theme="outline-primary"
                    title="Take Image"
                    onPress={() => openCamera()}
                  />
                </View>
                <View style={{flex: 1}}>
                  <CustomButton
                    theme="outline-primary"
                    title="Take Video"
                    onPress={() => openCameraVideo()}
                  />
                </View>
              </View>
            )}
          </>
        </Popup>
      )}
      <FlatList
        ref={talkRef}
        data={talk}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({item, index}) => {
          const date = new Date(item.time.substring(0, 19));
          const ampm = date.getHours() > 12 ? 'PM' : 'AM';
          const newDate = `${date.getHours()}:${date.getMinutes()} ${ampm}`;

          const dayMsg =
            talk[index === 0 ? index : index - 1].time.substring(0, 10) !==
              item.time.substring(0, 10) &&
            dateFormatter(item.time.substring(0, 10));

          return (
            <View style={styles.messageList}>
              <Text
                style={{
                  marginTop: 12,
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 12,
                }}>
                {index === 0
                  ? dateFormatter(item.time.substring(0, 10))
                  : dayMsg}
              </Text>
              {item.mediaUrl ? (
                <View
                  style={[
                    {flexDirection: 'row', alignItems: 'flex-end'},
                    item.messageKind === 1
                      ? {justifyContent: 'flex-start'}
                      : {justifyContent: 'flex-end'},
                  ]}>
                  {item.messageKind === 2 && (
                    <Text
                      style={{
                        marginRight: 8,
                        marginBottom: 8,
                        fontSize: 12,
                        fontWeight: '700',
                      }}>
                      {newDate}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      item.mediaType === 1
                        ? navigation.navigate('PhotoViewerScreen', {
                            imgUrl: item.mediaUrl,
                          })
                        : navigation.navigate('VideoViewerScreen', {
                            vidUrl: item.mediaUrl,
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
                      {item.mediaType === 1 ? (
                        <Image
                          style={{flex: 1}}
                          source={{uri: item.mediaUrl}}
                        />
                      ) : (
                        <View style={{flex: 1}}>
                          <Video
                            style={{flex: 1}}
                            source={{
                              uri: item.mediaUrl,
                            }}
                            resizeMode="cover"
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                  {item.messageKind === 1 && (
                    <Text
                      style={{
                        marginLeft: 8,
                        marginBottom: 8,
                        fontSize: 12,
                        fontWeight: '700',
                      }}>
                      {newDate}
                    </Text>
                  )}
                </View>
              ) : (
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    },
                    item.messageKind === 1
                      ? {justifyContent: 'flex-start'}
                      : {justifyContent: 'flex-end'},
                  ]}>
                  {item.messageKind === 2 && (
                    <Text
                      style={{
                        marginBottom: 8,
                        marginRight: 8,
                        fontSize: 12,
                        fontWeight: '700',
                      }}>
                      {newDate}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.inboxText,
                      item.messageKind === 1
                        ? {
                            backgroundColor: 'blue',
                            justifyContent: 'flex-start',
                          }
                        : {
                            backgroundColor: 'green',
                            justifyContent: 'flex-end',
                          },
                    ]}>
                    {item.message}
                  </Text>
                  {item.messageKind === 1 && (
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
              )}
            </View>
          );
        }}
      />
      <CustomChatControl
        disabled={typeTalk.length === 0 ? true : false}
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
    backgroundColor: 'white',
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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
