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

  console.log(profile);

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
          <View
            style={
              ([styles.profiledesc],
              profile && profile.aboutMe.length != 0
                ? {padding: 12}
                : {padding: 0})
            }>
            {profile && profile.aboutMe.length != 0 && (
              <Text style={styles.profiledesc}>{profile.aboutMe}</Text>
            )}
          </View>
          <View
            style={[
              {flexDirection: 'row', position: 'relative'},
              profile && profile.gender.length != 0
                ? {padding: 12}
                : {padding: 0},
            ]}>
            {profile && profile.gender != 0 && (
              <Text style={styles.label}>Sex</Text>
            )}
            {profile && profile.gender != 0 && (
              <Text style={styles.item}>
                {genderItems[profile.gender].label}
              </Text>
            )}
          </View>
          <View
            style={[
              {flexDirection: 'row', position: 'relative'},
              profile && profile.hobby.length != 0
                ? {padding: 12}
                : {padding: 0},
            ]}>
            {profile && profile.hobby.length != 0 && (
              <Text style={styles.label}>Hobby</Text>
            )}
            {profile && profile.hobby.length != 0 && (
              <Text style={styles.item}>{userHobby.toString()}</Text>
            )}
          </View>
          <View
            style={[
              {flexDirection: 'row', position: 'relative'},
              profile && profile.age.length != 0 ? {padding: 12} : {padding: 0},
            ]}>
            {profile && profile.age != 0 && (
              <Text style={styles.label}>Age</Text>
            )}
            {profile && profile.age != 0 && (
              <Text style={styles.item}>{profile.age}</Text>
            )}
          </View>
          <View
            style={[
              {flexDirection: 'row', position: 'relative'},
              profile && profile.job.length != 0 ? {padding: 12} : {padding: 0},
            ]}>
            {profile && profile.job != 0 && (
              <Text style={styles.label}>Occupation</Text>
            )}
            {profile && profile.job != 0 && (
              <Text style={styles.item}>{jobItems[profile.job].label}</Text>
            )}
          </View>
          <View
            style={[
              {flexDirection: 'row', position: 'relative'},
              profile && profile.residence.length != 0
                ? {padding: 12}
                : {padding: 0},
            ]}>
            {profile && profile.residence.length != 0 && (
              <Text style={styles.label}>Area</Text>
            )}
            {profile && profile.residence.length != 0 && (
              <Text style={styles.item}>{profile.residence}</Text>
            )}
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
          onPress={() =>
            navigation.navigate('MessageRoomScreen', {
              userId: userId,
              name: profile.nickname,
            })
          }>
          <Text>Send Message</Text>
        </CustomButton>
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
    marginBottom: 12,
  },
  item: {
    fontSize: 16,
    fontWeight: '600',
    position: 'absolute',
    top: 12,
    left: 120,
    color: 'black',
    flex: 1,
    width: 270,
  },
  button: {
    position: 'absolute',
  },
  profiledesc: {
    padding: 8,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
