import React, {state, useContext, useState} from 'react';
import axios from 'axios';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';

const SignUpScreen = ({navigation}) => {
  const [form, setForm] = useState({
    nickname: '',
    email: '',
    password: '',
    isValidNickname: true,
    isValidEmail: true,
    isValidPassword: true,
    secureTextEntry: true,
    nicknameValidation: '',
    emailValidation: '',
    passwordValidation: '',
    languageValidation: '',
  });

  const handleNicknameValidation = val => {
    if (!val) {
      setForm({
        ...form,
        isValidNickname: false,
        nicknameValidation: 'Nickname required',
      });
    } else if (val.length >= 20) {
      setForm({
        ...form,
        isValidNickname: false,
        nicknameValidation: 'Nickname cant more than 20',
      });
    } else {
      setForm({...form, isValidNickname: true, nicknameValidation: ''});
    }
  };

  const handleEmailValidation = val => {
    if (!val) {
      setForm({
        ...form,
        isValidEmail: false,
        emailValidation: 'Email required',
      });
    } else if (!val.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/)) {
      setForm({
        ...form,
        isValidEmail: false,
        emailValidation: "Email doesn't match rule",
      });
    } else {
      setForm({...form, isValidEmail: true, emailValidation: ''});
    }
  };

  const handlePasswordValidation = val => {
    if (!val) {
      setForm({
        ...form,
        isValidPassword: false,
        passwordValidation: 'Password required',
      });
    } else if (val.length <= 4) {
      setForm({
        ...form,
        isValidPassword: false,
        passwordValidation: 'Password must more than 4 character',
      });
    } else if (val.length >= 10) {
      setForm({
        ...form,
        isValidPassword: false,
        passwordValidation: 'Password must less than 10 character',
      });
    } else {
      setForm({...form, isValidPassword: true, passwordValidation: ''});
    }
  };

  const [state, dispatch] = useContext(AuthContext);
  const handleSignUp = async () => {
    const url = `https://terraresta.com/app/api/SignUpCtrl/SignUp?login_id=${form.email}&password=${form.password}&nickname=${form.nickname}`;
    axios.get(url).then(result => {
      if (result.data.status == 1) {
        const user = {
          token: result.data.accessToken,
          userId: result.data.userId,
        };
        AsyncStorage.setItem('USER', JSON.stringify(user)).then(() => {
          dispatch({
            type: 'SIGN_UP',
            token: result.data.accessToken,
            userId: result.data.userId,
          });
        });
      } else {
        alert(result.data.error.errorMessage);
      }
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.form}>
        <View style={styles.input_wrapper}>
          <Text style={styles.label}>Nickname</Text>
          <TextInput
            onChangeText={val => setForm({...form, nickname: val})}
            onEndEditing={e => handleNicknameValidation(e.nativeEvent.text)}
            style={styles.input}
          />
          {form.isValidNickname ? null : (
            <Text style={styles.validation}>{form.nicknameValidation}</Text>
          )}
        </View>
        <View style={styles.input_wrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            onChangeText={val => setForm({...form, email: val})}
            onEndEditing={e => handleEmailValidation(e.nativeEvent.text)}
            style={styles.input}
          />
          {form.isValidEmail ? null : (
            <Text style={styles.validation}>{form.emailValidation}</Text>
          )}
        </View>
        <View style={styles.input_wrapper}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry={form.secureTextEntry ? true : false}
            onChangeText={val => setForm({...form, password: val})}
            onEndEditing={e => handlePasswordValidation(e.nativeEvent.text)}
            style={styles.input}
          />
          {form.isValidPassword ? null : (
            <Text style={styles.validation}>{form.passwordValidation}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSignUp()}
        disabled={
          !form.nickname || !form.email || !form.password
            ? true
            : false
        }>
        <Text style={{color: 'white', textAlign: 'center'}}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  input_wrapper: {marginBottom: 4},
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderStyle: 'solid',
    color: 'black',
  },
  validation: {color: 'red', fontSize: 10},
  hidden: {display: 'none'},
  button: {
    backgroundColor: '#1644BD',
    padding: 12,
    marginBottom: 16,
    marginTop: 16,
  },
});
