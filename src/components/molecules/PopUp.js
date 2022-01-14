import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const Popup = ({children, popup, setPopup}) => {
  return (
    <Modal transparent visible={popup}>
      <TouchableWithoutFeedback onPress={() => setPopup(!popup)}>
        <View style={styles.wrapper}>
          <View style={{backgroundColor: 'white', padding: 16}}>
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Popup;

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9999,
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
