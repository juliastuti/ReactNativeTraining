import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditProfileScreen = () => {
  return <View></View>;
};

export default EditProfileScreen;

const styles = StyleSheet.create({});

// import React from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import CustomInput from '../components/atoms/CustomInput';

// const EditProfileScreen = () => {
//   const [form, setForm] = useState({
//     nickname: '',
//     birthday: '',
//     recidence: '',
//     gender: '',
//     job: '',
//     personality: '',
//     hobby: '',
//     aboutMe: '',
//     isValidNickname: true,
//     isValidBirthday: true,
//     isValidRecidence: true,
//     isValidGender: true,
//     isValidJob: true,
//     isValidPersonality: true,
//     isValidHobby: true,
//     isValidAboutMe: true,
//     nicknameValidation: '',
//     birthdayValidation: '',
//     recidenceValidation: '',
//     genderValidation: '',
//     jobValidation: '',
//     personalityValidation: '',
//     hobbyValidation: '',
//     aboutMeValidation: '',
//   })

//   const handleNicknameValidation = val => {
//     if (!val) {
//       setForm({...form, isValidNickname: false, nicknameValidation: 'Nickname is required'})
//     } else if (val.length >= 20){
//       setForm({...form, isValidNickname: true, nicknameValidation: 'Nickname cant more than 20'})
//     } else {
//       setForm({...form, isValidNickname: true, nicknameValidation: ''})
//     }
//   };

//   const handleRecidenceValidation = val => {
//     if (!val) {
//       setForm({...form, isValidRecidence: false, recidenceValidation: 'Select recidence'})
//     } else {
//       setForm({...form, isValidRecidence: true, recidenceValidation: ''})
//     }
//   }

//   const handleBirthdayValidation = val => {
//     if (!val) {
//       setForm({...form, isValidBirthday: false, birthdayValidation: 'Select birthday'})
//     } else {

//     }
//   }
//   return (
//     <SafeAreaView>
//       <ScrollView>
//         <View>
//           <CustomInput
//           onChangeText={val => setForm({...})}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default EditProfileScreen;

// const styles = StyleSheet.create({});
