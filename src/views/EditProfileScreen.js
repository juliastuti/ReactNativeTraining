import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AuthContext} from '../context';
import {
  CustomInput,
  CustomSelect,
  CustomButton,
  CustomMultiSelect,
  CustomDatePicker,
} from '../components/atoms';
import {
  genderItems,
  hobbyItems,
  jobItems,
  personalityItems,
  recidenceItems,
} from '../selectItems/SelectItem';
import {CustomModal} from '../components/molecules';
import getClient from '../services/getClient';

const EditProfileScreen = ({navigation, label}) => {
  const handleNicknameValidation = val => {
    if (!val) {
      setNickname({
        ...nickname,
        isValidNickname: false,
        nicknameValidation: 'Username is required',
      });
    } else if (val.length >= 20) {
      setNickname({
        ...nickname,
        isValidNickname: false,
        nicknameValidation: 'Username cant more than 20',
      });
    } else if (!val.match(/^[a-z0-9]+$/i)) {
      setNickname({
        ...nickname,
        isValidNickname: false,
        nicknameValidation: 'Nickname must alphanumeric',
      });
    } else {
      setNickname({...nickname, isValidNickname: true, nicknameValidation: ''});
    }
  };

  const handleAboutMeValidation = val => {
    if (!val) {
      setAbout({
        ...about,
        isValidAboutMe: false,
        aboutMeValidation: 'About Me kosong',
      });
    } else {
      setAbout({...about, isValidAboutMe: true, aboutMeValidation: ''});
    }
  };

  const [user, dispatch] = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const [counter, setCounter] = useState(0);

  // form data
  const [nickname, setNickname] = useState({
    nickname: '',
    isValidNickname: true,
    nicknameValidation: '',
  });
  const [about, setAbout] = useState({
    about: '',
    isValidAbout: true,
    aboutValidation: '',
  });
  const [birthday, setBirthday] = useState(new Date());
  const [gender, setGender] = useState('');
  const [job, setJob] = useState('');
  const [recidence, setRecidence] = useState('');
  const [personality, setPersonality] = useState('');
  const [hobby, setHobby] = useState([]);

  const [current, setCurrent] = useState({
    nickname: '',
    birthday: '',
    gender: '',
    job: '',
    recidence: '',
    hobby: '',
    personality: '',
    about: '',
  });

  const currDate = `${birthday.getFullYear()} / ${
    birthday.getUTCMonth() + 1
  } / ${birthday.getDate() < 10 && 0}${birthday.getDate()}`;

  const handleCancelEdit = () => {
    if (
      nickname.nickname != current.nickname ||
      // currDate != current.birthday ||
      gender != current.gender ||
      job != current.job ||
      recidence != current.recidence ||
      hobby.length != current.hobby.length ||
      personality != current.personality ||
      about.about != current.about
    ) {
      setModal(true);
    } else {
      navigation.navigate('MyPageScreen');
    }
  };

  const handleGetProfile = () => {
    console.log('Request Data Profile Display', {
      access_token: user.token,
      user_id: user.userId,
    });
    getClient
      .get('ProfileCtrl/ProfileDisplay', {
        params: {
          access_token: user.token,
          user_id: user.userId,
        },
      })
      .then(res => {
        if (res.data.status == 1) {
          setNickname({...nickname, nickname: res.data.nickname});
          setBirthday(
            res.data.birthday ? new Date(res.data.birthday) : new Date(),
          );
          setGender(res.data.gender);
          setJob(res.data.job);
          setRecidence(res.data.residence);
          setHobby(
            res.data.hobby.length === 0
              ? []
              : res.data.hobby.split(',').map(item => {
                  return parseInt(item);
                }),
          );
          setPersonality(res.data.personality);
          setAbout({...about, about: res.data.aboutMe});
          setCounter(res.data.aboutMe.length);

          setCurrent({
            ...current,
            nickname: res.data.nickname,
            birthday: res.data.birthday,
            gender: res.data.gender,
            job: res.data.job,
            recidence: res.data.residence,
            hobby:
              res.data.hobby.length === 0
                ? []
                : res.data.hobby.split(',').map(item => {
                    return parseInt(item);
                  }),
            personality: res.data.personality,
            about: res.data.aboutMe,
          });
        }
      });
  };

  useEffect(() => {
    handleGetProfile();
  }, []);

  const handleEditProfile = () => {
    console.log('Requert Data Edit Profile', {
      nickname: nickname.nickname,
      birthday,
      gender,
      job,
      recidence,
      personality,
      hobby,
      about: about.about,
    });
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': 82,
    };

    const params = new URLSearchParams();
    params.append('nickname', nickname.nickname);
    params.append('birthday', birthday.toISOString());
    params.append('gender', gender);
    params.append('job', job);
    params.append('residence', recidence);
    params.append('personality', personality);
    params.append('hobby', hobby);
    params.append('about_me', about.about);

    getClient
      .post(
        `ProfileCtrl/ProfileEdit?access_token=${user.token}`,
        params,
        headers,
      )
      .then(res => {
        if (res.data.status === 1) {
          navigation.navigate('MyPageScreen');
          handleGetProfile();
        }
      });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{marginRight: 32}}>
          <TouchableWithoutFeedback onPress={() => handleCancelEdit()}>
            <Icon name="arrow-left" size={23} color="black" />
          </TouchableWithoutFeedback>
        </View>
      ),
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => handleEditProfile()}>
          <Text
            style={{
              paddingRight: 16,
              color: '#1644BD',
              fontWeight: 'bold',
            }}>
            Save
          </Text>
        </TouchableWithoutFeedback>
      ),
    });
  }, [nickname, birthday, gender, job, recidence, hobby, personality, about]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        {modal && (
          <CustomModal modal={modal} setModal={setModal}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '800',
                color: 'black',
                fontSize: 18,
                marginBottom: 16,
              }}>
              Data is not saved, do you want to discard the data?
            </Text>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={{flex: 1, marginRight: 4}}>
                <CustomButton
                  title="No"
                  onPress={() => setModal(!modal)}
                  theme="outline-primary"
                />
              </View>
              <View style={{flex: 1, marginLeft: 4}}>
                <CustomButton
                  title="Yes"
                  onPress={() => navigation.navigate('MyPageScreen')}
                  theme="primary"
                />
              </View>
            </View>
          </CustomModal>
        )}
        <ScrollView>
          <View style={styles.form}>
            <CustomInput
              value={nickname.nickname}
              onChangeText={val => setNickname({...nickname, nickname: val})}
              onEndEditing={e => handleNicknameValidation(e.nativeEvent.text)}
              label="Username"
              placeholder="Username"
              isValid={nickname.isValidNickname}
              validation={nickname.nicknameValidation}
            />
            <CustomDatePicker
              label="Birtday"
              date={birthday}
              setDate={setBirthday}
            />
            <CustomSelect
              label="Sex"
              // placeholder="Sex"
              data={genderItems}
              value={gender}
              setValue={setGender}
              selected="Select Gender"
            />
            <CustomSelect
              label="Occupation"
              // placeholder="Occupation"
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
              title="Hobby"
              items={hobbyItems}
              selected={hobby}
              setSelected={setHobby}
              placeholder="Hobby"
            />

            <CustomSelect
              label="Character"
              data={personalityItems}
              value={personality}
              setValue={setPersonality}
            />

            <CustomInput
              value={about.about}
              maxLength={200}
              onChangeText={val => {
                setAbout({...about, about: val});
                setCounter(val.length);
              }}
              onEndEditing={e => handleAboutMeValidation(e.nativeEvent.text)}
              label="Freeword"
              placeholder="Freeword"
              isValid={about.isValidAbout}
              showCounter
              counter={counter}
              validation={about.aboutValidation}
            />
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
