import React from 'react';
import {Modal, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

const CustomModal = ({modal, setModal, children}) => {
  return (
    <Modal animationType="fade" transparent visible={modal}>
      <TouchableWithoutFeedback onPress={() => setModal(!modal)}>
        <View style={styles.wrapper}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 16,
              marginHorizontal: 32,
              borderRadius: 16,
            }}>
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9999,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
