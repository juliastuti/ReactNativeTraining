import {Modal, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Video from 'react-native-video';
import {useRef} from 'react';

const VideoViewerScreen = ({navigation, route}) => {
  const {vidUrl} = route.params;
  const player = useRef();

  return (
    <Modal visible={true} transparent={true}>
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Video
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            source={{
              uri: vidUrl,
            }}
            controls
            ref={player}
            paused={false}
            resizeMode="contain"
          />
        </View>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Icon
            name="left"
            size={24}
            color="white"
            style={{position: 'absolute', top: 20, left: 16, zIndex: 9999}}
          />
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

export default VideoViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'black',
  },
});
