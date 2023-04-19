import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
//navigators
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import SearchScreen from './screens/SearchScreen';
import ExtendedDetailScreen from './screens/ExtendedDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import AddEstateScreen from './screens/AddEstateScreen';
import AlertsScreen from './screens/AlertsScreen';
import AccountScreen from './screens/AccountScreen';
//icons
import { Feather } from '@expo/vector-icons';
//colors
import { Colors } from './constants/styles';
//auth context
import AuthContextProvider, { AuthContext } from './context/auth-context';
//local storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
//fav context
import FavoriteContextProvider from './context/favorite-context';
// sqlite favorites init
import { init as initFavorites } from "./util/persistence";
// sqlite user posted ads init
import { init as initUserAds } from './util/userAds';
// user listing context
import UserListingContextProvider from './context/user-listing-context';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }} >
//   <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerTitle: 'Login' }} />
//   <Stack.Screen name='SignupScreen' component={SignupScreen} options={{ headerTitle: 'Signup', headerBackVisible: false }} />
//   <Stack.Screen name='MainFlow' component={MainFlow} options={{ headerShown: false }} />
// </Stack.Navigator>



const AuthFlow = () => {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center', animation: 'slide_from_right' }} >
      <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerTitle: 'Login', headerBackVisible: false, headerShown: false }} />
      <Stack.Screen name='SignupScreen' component={SignupScreen} options={{ headerTitle: 'Signup', headerBackVisible: false, headerShown: false }} />
    </Stack.Navigator>
  );

}

const MainFlow = () => {
  return (
    <Tab.Navigator screenOptions={{ headerTitleAlign: 'center', tabBarActiveTintColor: Colors.primaryPurple }}>
      <Tab.Screen
        name='Search'
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ size, color }) => (
            <Feather name="search" size={size} color={color} />)
        }}
      />
      <Tab.Screen
        name='Favorites'
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ size, color }) => (
            <Feather name="heart" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name='Add Estate'
        component={AddEstateScreen}
        options={{
          tabBarLabel: 'Sell',
          tabBarIcon: ({ size, color }) => (
            <Feather name='plus-square' size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name='Alerts'
        component={AlertsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ size, color }) => (
            <Feather name="bell" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name='Account'
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ size, color }) => (
            <Feather name="user" size={size} color={color} />
          )
        }} />
    </Tab.Navigator>
  );
}


//extra component to help switch 
const NavigatorSwitch = () => {
  const authContext = useContext(AuthContext);

  return (
    <NavigationContainer>
      {authContext.isAuthenticated ? (
        <UserListingContextProvider>
          <FavoriteContextProvider>
            <MainFlow />
          </FavoriteContextProvider>
        </UserListingContextProvider>
      ) : (<AuthFlow />)}
    </NavigationContainer>
  )
}


//function that checks for the token in local storage
//and automatically authenticates if found
const TryLocalAuth = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setAppIsReady(true);
    };
    fetchToken();
  }, []);

  //keep the splash screen visible while the app still loads
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  //finally return the content
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigatorSwitch />
    </View>
  );
};


export default function App() {

  useEffect(() => {
    initFavorites()
      .then(() => {
        console.log("Favorites DB initialize success");
      })
      .catch(err => {
        console.log(err);
      });
    initUserAds()
      .then(() => {
        console.log("User ads DB initialize success");
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <StatusBar style='auto' />
      <AuthContextProvider>
        <TryLocalAuth />
      </AuthContextProvider>
    </>
  )
}