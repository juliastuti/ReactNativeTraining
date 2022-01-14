import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';
import getClient from '../services/getClient';

const LoginScreen = ({navigation}) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    isValidEmail: true,
    isValidPassword: true,
    secureTextEntry: true,
    emailValidation: '',
    passwordValidation: '',
  });

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
  const handleLogin = async () => {
    console.log('Req data Login', {
      email: form.email,
      password: form.password,
    });

    const url = 'http://terraresta.com/app/api/LoginCtrl/Login';
    getClient
      .get(url, {
        params: {
          login_id: form.email,
          password: form.password,
        },
      })
      .then(result => {
        if (result.data.status == 1) {
          const user = {
            token: result.data.accessToken,
            userId: result.data.userId,
          };
          console.log('response get profile', result.data);
          AsyncStorage.setItem('USER', JSON.stringify(user)).then(() => {
            dispatch({
              type: 'LOGIN',
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
      <View style={styles.form_wrapper}>
        <View style={styles.input_wrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            onChangeText={val => setForm({...form, email: val})}
            onEndEditing={e => handleEmailValidation(e.nativeEvent.text)}
            style={styles.input}
            autoCapitalize="none"
            placeholder="Email"
            keyboardType="email-address"
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
            placeholder="Password"
          />
          {form.isValidPassword ? null : (
            <Text style={styles.validation}>{form.passwordValidation}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLogin()}
        disabled={!form.email || !form.password ? true : false}>
        <Text style={{color: 'white', textAlign: 'center'}}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
