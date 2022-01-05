import React from 'react';
import {StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

const TermConditionScreen = () => {
  return (
    <WebView
      source={{
        uri: 'https://s3-ap-northeast-1.amazonaws.com/app-lesson-media/',
      }}
      style={{marginTop: 20}}
    />
  );
};

export default TermConditionScreen;

const styles = StyleSheet.create({});
