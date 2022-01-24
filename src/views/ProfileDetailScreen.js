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
import {
  genderItems,
  hobbyItems,
  jobItems,
  personalityItems,
} from '../selectItems/SelectItem';
import getClient from '../services/getClient';

const ProfileDetailScreen = ({route, navigation}) => {
  const [profile, setProfile] = useState(null);

  const [user] = useContext(AuthContext);
  const {userId} = route.params;

  const handleGetUserProfile = () => {
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

  console.log('profile');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView>
        <View
          style={{
            width: '100%',
            position: 'relative',
            paddingBottom: 80,
            display: 'flex',
          }}>
          <View style={{position: 'relative', height: 250}}>
            {profile && profile.imageUrl ? (
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
                    uri: profile && profile.imageUrl,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <Image
                style={styles.profileimage}
                source={{
                  uri: 'https://via.placeholder.com/500',
                }}
              />
            )}

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
          <View style={{flexDirection: 'row', padding: 16}}>
            <View style={{paddingTop: 16}}>
              {profile && profile.gender.length != 0 && (
                <Text style={styles.label}>Sex</Text>
              )}
              {profile && profile.hobby.length != 0 && (
                <Text style={styles.label}>Hobby</Text>
              )}
              {profile && profile.age.length != 0 && (
                <Text style={styles.label}>Age</Text>
              )}
              {/* {profile && profile.job.length != 0 && (
                <Text style={styles.label}>Job</Text>
              )} */}
              {profile && profile.personality.length != 0 && (
                <Text style={styles.label}>Occupation</Text>
              )}
              {profile && profile.residence.length != 0 && (
                <Text style={styles.label}>Area</Text>
              )}
            </View>
            <View style={{paddingLeft: 60, paddingTop: 16, marginRight: 16}}>
              {profile && profile.gender.length != 0 && (
                <Text style={styles.label}>
                  {genderItems[profile.gender].label}
                </Text>
              )}
              {profile && profile.hobby.length != 0 && (
                <Text style={styles.label}>{userHobby.toString()}</Text>
              )}
              {profile && profile.age.length != 0 && (
                <Text style={styles.label}>{profile.age}</Text>
              )}
              {profile && profile.job.length != 0 && (
                <Text style={styles.label}>{jobItems[profile.job].label}</Text>
              )}
              {/* {profile && profile.personality.length != 0 && (
                <Text style={styles.label}>
                  {personalityItems[profile.personality].label}
                </Text>
              )} */}
              {profile && profile.residence.length != 0 && (
                <Text style={styles.label}>{profile.residence}</Text>
              )}
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
          onPress={() => navigation.navigate('MessageScreen')}
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
