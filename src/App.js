import React, {useEffect, useReducer} from 'react';
import {Button, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from './context';
import {
  AuthScreen,
  FeedScreen,
  HomeScreen,
  LoginScreen,
  MessageScreen,
  MyPageScreen,
  SignUpScreen,
  TermConditionScreen,
  EditProfileScreen,
  ProfileDetailScreen,
} from './views';
import {AuthReducer} from './reducers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import getClient from './services/getClient';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [state, dispatch] = useReducer(AuthReducer, {
    token: null,
    userId: null,
  });

  const handleLogout = () => {
    AsyncStorage.removeItem('USER').then(() => {
      dispatch({type: 'LOGOUT'});
    });
  };

  const getToken = () => {
    AsyncStorage.getItem('USER').then(res => {
      if (res) {
        const user = JSON.parse(res);
        dispatch({
          type: 'RESTORE_TOKEN',
          token: user.token,
          userId: user.userId,
        });
      }
    });
  };

  useEffect(() => {
    getToken();
  }, []);

  const HomeNavigator = ({navigation}) => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color}) => {
            let iconName;

            if (route.name === 'FeedScreen') {
              iconName = 'image-multiple';
            } else if (route.name === 'MessageScreen') {
              iconName = 'message-text';
            } else if (route.name === 'MyPageScreen') {
              iconName = 'account';
            }

            return <Icon name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: '#1644BD',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="FeedScreen"
          options={{
            title: 'Feed',
            headerTitle: 'TrainingApps',
            headerTitleAlign: 'center',
          }}
          component={FeedScreen}
        />
        <Tab.Screen
          name="MessageScreen"
          options={{
            title: 'Message',
            headerTitle: 'TrainingApps',
            headerTitleAlign: 'center',
          }}
          component={MessageScreen}
        />
        <Tab.Screen
          name="MyPageScreen"
          options={{
            title: 'MyPage',
            headerTitle: 'TrainingApps',
            headerTitleAlign: 'center',
            headerRight: () => (
              <Text
                onPress={() => handleLogout()}
                style={{
                  paddingRight: 16,
                  color: '#1644BD',
                  fontWeight: 'bold',
                }}>
                Logout
              </Text>
            ),
          }}
          component={MyPageScreen}
        />
      </Tab.Navigator>
    );
  };

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.token == null ? (
            <>
              <Stack.Screen
                name="AuthScreen"
                component={AuthScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{title: 'SignUp'}}
              />
              <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{title: 'Login'}}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="HomeScreen"
                component={HomeNavigator}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="TermConditionScreen"
                component={TermConditionScreen}
                options={{headerTitle: 'Term & Condition'}}
              />
              <Stack.Screen
                name="EditProfileScreen"
                component={EditProfileScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ProfileDetailScreen"
                component={ProfileDetailScreen}
                options={{headerTitle: 'Profile Detail'}}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
