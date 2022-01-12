import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {AuthContext} from '../context';
import {
  CustomInput,
  CustomSelect,
  CustomButton,
  CustomMultiSelect,
  CustomDatePicker,
} from '../components/atoms';
import getClient from '../services/getClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EditProfileScreen = ({navigation, label}) => {
  const [user, dispatch] = useContext(AuthContext);
  const [form, setForm] = useState({
    nickname: '',
    birthday: '',
    recidence: '',
    gender: '',
    job: '',
    personality: '',
    hobby: '',
    aboutMe: '',
    isValidNickname: true,
    isValidBirthday: true,
    isValidRecidence: true,
    isValidGender: true,
    isValidJob: true,
    isValidPersonality: true,
    isValidHobby: true,
    isValidAboutMe: true,
    nicknameValidation: '',
    birthdayValidation: '',
    recidenceValidation: '',
    genderValidation: '',
    jobValidation: '',
    personalityValidation: '',
    hobbyValidation: '',
    aboutMeValidation: '',
  });

  const handleNicknameValidation = val => {
    if (!val) {
      setForm({
        ...form,
        isValidNickname: false,
        nicknameValidation: 'Username is required',
      });
    } else if (val.length >= 20) {
      setForm({
        ...form,
        isValidNickname: false,
        nicknameValidation: 'Username cant more than 20',
      });
    } else {
      setForm({...form, isValidNickname: true, nicknameValidation: ''});
    }
  };

  const handleAboutMeValidation = val => {
    if (!val) {
      setForm({
        ...form,
        isValidAboutMe: false,
        aboutMeValidation: 'About Me kosong',
      });
    } else {
      setForm({...form, isValidAboutMe: true, aboutMeValidation: ''});
    }
  };

  const [date, setDate] = useState(new Date());

  const [gender, setGender] = useState('Unknown');
  const genderItems = [
    {label: 'Sex', value: 'Unknown'},
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
  ];

  const [job, setJob] = useState('Unknown');
  const jobItems = [
    {label: 'Occupation', value: 'Unknown'},
    {label: 'Civil servant', value: 'civilServant'},
    {label: 'Self employed', value: 'selfEmployed'},
    {label: 'Freelance', value: 'freelance'},
    {label: 'Part time', value: 'partTime'},
    {label: 'Other', value: 'other'},
  ];

  const [recidence, setRecidence] = useState('Unknown');
  const recidenceItems = [
    {label: 'Area', value: 'Unknown'},
    {label: 'Denpasar', value: 'denpasar'},
    {label: 'Badung', value: 'badung'},
    {label: 'Gianyar', value: 'gianyar'},
    {label: 'Klungkung', value: 'klungkung'},
  ];

  const [personality, setPersonality] = useState('Unknown');
  const personalityItems = [
    {label: 'Character', value: 'Unknown'},
    {label: 'item 1', value: 'item1'},
    {label: 'item 2', value: 'item2'},
    {label: 'item 3', value: 'item3'},
  ];

  const [hobby, setHobby] = useState([]);
  const hobbyItems = [
    {id: 1, name: 'music'},
    {id: 2, name: 'writing'},
    {id: 3, name: 'watching'},
    {id: 4, name: 'gaming'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <ScrollView>
          <View style={styles.form}>
            <CustomInput
              value={form.nickname}
              onChangeText={val => setForm({...form, nickname: val})}
              onEndEditing={e => handleNicknameValidation(e.nativeEvent.text)}
              label="Username"
              placeholder="Username"
              isValid={form.isValidNickname}
              validation={form.nicknameValidation}
            />
            <CustomDatePicker
              label="Birtday"
              date={date}
              onDateChange={setDate}
            />
            <CustomSelect
              placeholder="Sex"
              label="Sex"
              data={genderItems}
              value={gender}
              setValue={setGender}
            />
            <CustomSelect
              label="Occupation"
              data={jobItems}
              value={job}
              setValue={setJob}
            />
            <CustomSelect
              label="Area"
              data={recidenceItems}
              value={recidence}
              setValue={setRecidence}
            />
            <CustomMultiSelect
              label="Hobby"
              items={hobbyItems}
              value={hobby}
              setValue={setHobby}
            />
            <CustomSelect
              label="Character"
              data={personalityItems}
              value={personality}
              setValue={setPersonality}
            />
            <View style={styles.input_wrapper}>
              <Text style={styles.label}>Freeword</Text>
              <TextInput
                onChangeText={val => setForm({...form, about_me: val})}
                onEndEditing={e => handleAboutMeValidation(e.nativeEvent.text)}
                style={styles.input}
                placeholder="Freeword"
              />
              {form.isValidAboutMe ? null : (
                <Text style={styles.validation}>{form.aboutMeValidation}</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  wrapper: {
    padding: 16,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  input_wrapper: {marginBottom: 20},
  label: {
    fontWeight: 'bold',
    fontSize: 14,
  },
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
