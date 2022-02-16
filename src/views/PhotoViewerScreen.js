import {Modal, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/AntDesign';

const PhotoViewerScreen = ({navigation, route}) => {
  const {userId, imgUrl} = route.params;
  const images = [
    {
      url: imgUrl,
    },
  ];

  return (
    <Modal visible={true} transparent={true}>
      <ImageViewer
        imageUrls={images}
        renderHeader={() => (
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Icon
              name="left"
              size={24}
              color="white"
              style={{position: 'absolute', top: 20, left: 16, zIndex: 9999}}
            />
          </TouchableWithoutFeedback>
        )}
      />
    </Modal>
  );
};

export default PhotoViewerScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    padding: 60,
  },
});
