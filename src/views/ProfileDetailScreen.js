import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from 'react-native';
import {CustomButton} from '../components/atoms';
import {CustomModal} from '../components/molecules';
import {AuthContext} from '../context';
import {genderItems, hobbyItems, jobItems} from '../selectItems/SelectItem';
import getClient from '../services/getClient';

const ProfileDetailScreen = ({route, navigation}) => {
  const [profile, setProfile] = useState(null);
  const [user, dispatch] = useContext(AuthContext);
  const {userId} = route.params;
  console.log(userId);

  const handleGetUserProfile = () => {
    console.log(user.token, userId);
    getClient
      .get('ProfileCtrl/ProfileDisplay', {
        params: {
          access_token: user.token,
          user_id: userId,
        },
      })
      .then(res => {
        if (res.data.status == 1) {
          setProfile(res.data);
        }
      });
  };

  useEffect(() => {
    handleGetUserProfile();
  }, []);

  const userHobby =
    profile &&
    profile.hobby.split(',').map((item, i) => {
      return hobbyItems[Number(item)].label;
    });

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View
          style={{
            width: '100%',
            position: 'relative',
            paddingBottom: 80,
            display: 'flex',
            backgroundColor: 'white',
          }}>
          <View style={{position: 'relative', height: 250}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('PhotoViewerScreen', {
                  userId,
                  imgUrl: profile.imageUrl,
                })
              }>
              <Image
                style={styles.profileimage}
                source={{
                  uri: profile
                    ? profile.imageUrl
                    : 'https://via.placeholder.com/250',
                }}
              />
            </TouchableOpacity>
            )
            <Text
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                color: 'white',
                fontWeight: '700',
                fontSize: 18,
              }}>
              {profile && profile.nickname}
            </Text>
          </View>
          <Text style={styles.profiledesc}></Text>
          <View style={{flexDirection: 'row', padding: 16}}>
            <View style={{paddingTop: 16}}>
              {profile
                ? profile.gender && <Text style={styles.label}>Sex</Text>
                : ''}
              {profile
                ? profile.age && <Text style={styles.label}>Age</Text>
                : ''}
              {profile
                ? profile.job && <Text style={styles.label}>Occupation</Text>
                : ''}
              {profile
                ? profile.hobby && <Text style={styles.label}>Hobby</Text>
                : ''}
              {profile
                ? profile.residence && <Text style={style.label}>Area</Text>
                : ''}
            </View>
            <View style={{paddingLeft: 60, paddingTop: 16, marginRight: 16}}>
              <Text style={styles.label}>
                {profile && genderItems[profile.gender].label}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          display: 'flex',
          padding: 16,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
        }}>
        <CustomButton
          title="Send Message"
          theme="primary"
          onPress={() => {
            navigation.navigate = 'MessageScreen';
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProfileDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileimage: {
    width: '100%',
    height: 250,
    backgroundColor: 'black',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    marginBottom: 16,
  },
  button: {
    position: 'absolute',
  },
  profiledesc: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
