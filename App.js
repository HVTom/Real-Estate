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
import FavoritesScreen from './screens/FavoritesScreen';
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
    <Tab.Navigator screenOptions={{ headerTitleAlign: 'center', tabBarActiveTintColor: '#7e5aa3' }}>
      <Tab.Screen
        name='SearchScreen'
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />)
        }}
      />
      <Tab.Screen
        name='FavoritesScreen'
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Feather name="heart" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name='AlertsScreen'
        component={AlertsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ size, color }) => (
            <Feather name="bell" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name='AccountScreen'
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
      {authContext.isAuthenticated ? (<MainFlow />) : (<AuthFlow />)}
    </NavigationContainer>
  )
}


//function that check for the token in local storage
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
  return (
    <>
      <StatusBar style='auto' />
      <AuthContextProvider>
        <TryLocalAuth />
      </AuthContextProvider>
    </>
  )
}