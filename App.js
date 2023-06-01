import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
//navigators
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import SearchScreen from './screens/SearchScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import AddEstateScreen from './screens/AddEstateScreen';
import AlertsScreen from './screens/AlertsScreen';
import AccountScreen from './screens/AccountScreen';
import ChartsScreen from './screens/ChartsScreen';
// icons
import { Feather } from '@expo/vector-icons';
// colors
import { Colors } from './constants/styles';
// auth context
import AuthContextProvider, { AuthContext } from './context/auth-context';
// local storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
//fav context
import FavoriteContextProvider from './context/favorite-context';
//search context
import SearchContextProvider, { SearchContext } from './context/search-context';
// sqlite favorites init
import { init as initFavorites } from "./util/favs";
// sqlite user posted ads init
import { init as initUserAds } from './util/userAds';
// sqlite saved searches init
import { init as initSavedSearches } from './util/search';
// user listing context
import UserListingContextProvider from './context/user-listing-context';
// fetch new ads and look inside saved searches
import { fetchNewAds } from "./util/db";
// dqlite search db fetch
import { readSavedSearch } from "./util/search";
// notifications imports
import * as Notifications from 'expo-notifications';





const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

// <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }} >
//   <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerTitle: 'Login' }} />
//   <Stack.Screen name='SignupScreen' component={SignupScreen} options={{ headerTitle: 'Signup', headerBackVisible: false }} />
//   <Stack.Screen name='MainFlow' component={MainFlow} options={{ headerShown: false }} />
// </Stack.Navigator>

const TopTabFlow = () => {
  return (
    <TopTab.Navigator screenOptions={{ tabBarItemStyle: { height: 85, top: 15 } }} >
      <TopTab.Screen name='Favorites' component={FavoritesScreen} options={{ headerTitle: 'Favorites' }} />
      <TopTab.Screen name='Alerts' component={AlertsScreen} options={{ headerTitle: 'Saved Searches' }} />
    </TopTab.Navigator>
  );
}


const AuthFlow = () => {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center', animation: 'slide_from_right' }} >
      <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerTitle: 'Login', headerBackVisible: false, headerShown: false }} />
      <Stack.Screen name='SignupScreen' component={SignupScreen} options={{ headerTitle: 'Signup', headerBackVisible: false, headerShown: false }} />
      <Stack.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} options={{ headerTitle: 'Forgot Password', headerBackVisible: false, headerShown: false }} />
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
      {/* <Tab.Screen
        name='Favorites'
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ size, color }) => (
            <Feather name="heart" size={size} color={color} />
          )
        }}
      /> */}
      {/*2 top tabs nested in a bottom tab*/}
      <TopTab.Screen
        name="Favs"
        component={TopTabFlow}
        options={{
          headerShown: false,
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
      {/* <Tab.Screen
        name='Alerts'
        component={AlertsScreen}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ size, color }) => (
            <Feather name="bell" size={size} color={color} />
          )
        }}
      /> */}
      <Tab.Screen
        name='Stats'
        component={ChartsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({ size, color }) => (
            <Feather name='bar-chart-2' size={size} color={color} />
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
        <SearchContextProvider>
          <UserListingContextProvider>
            <FavoriteContextProvider>
              <MainFlow />
            </FavoriteContextProvider>
          </UserListingContextProvider>
        </SearchContextProvider>
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





// notifications options
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  }),
});

// "schedule" notification when there are new ads
// based on saved locations
function scheduleNotificationHandler(message) {
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'New listings!',
      body: message,
    },
    trigger: {
      seconds: 1
    }
  });
}


export default function App() {
  // const [searches, setSearches] = useState([]);
  // const [newListings, setNewListings] = useState([]);
  // const [count, setCount] = useState(0);
  // const srchContext = useContext(SearchContext);


  const storeTimestamp = async (openTime) => {
    try {
      let timestamp = JSON.stringify(openTime);
      await AsyncStorage.setItem('timestamp', timestamp);
      console.log(`Timestamp with value ${timestamp} updated successfully\n`);
    } catch (e) {
      console.log("Timestamp save err: ", e);
    }
  }

  const getTimestamp = async () => {
    try {
      const timestamp = await AsyncStorage.getItem('timestamp')
      return timestamp != null ? JSON.parse(timestamp) : null;
    } catch (e) {
      console.log('Error extracting timestamp: ', e);
    }
  }



  useEffect(() => {
    // record a timestamp when the app initializez
    const timestampAtOpen = Date.now();


    // get ads with timestamps within range previous and current
    async function checkNewAds() {
      try {
        const resp = await readSavedSearch(); // read saved searches from sqlite
        const responseSearches = resp.rows._array;
        console.log('Sqlite saved searches: ', responseSearches);
        let locationArr = [];
        for (let l in responseSearches) {
          locationArr.push(responseSearches[l].location);
          //console.log("location arr: ", locationArr);
        }

        let prev = await getTimestamp();
        //console.log("prev: ", prev);
        let curr = timestampAtOpen;
        //console.log("curr: ", curr);

        // for (let L in locationArr) {
        //   console.log(locationArr[L]);
        // }

        const response = await fetchNewAds(prev, curr); // fetch new listings in timestamp range
        // check which locations are saved, send local notif
        for (let l in locationArr) {
          let count = 0;
          let message = ``;
          for (let r in response) {
            if (response[r].location === locationArr[l]) {
              count++;
            }
          }
          if (count == 1) {
            message = `${count} new listing in ${locationArr[l]}`;
            scheduleNotificationHandler(message);
          } else if (count > 1) {
            message = `${count} new listings in ${locationArr[l]}`;
            scheduleNotificationHandler(message);
          }
        }
        // update current session timestamp: 
        storeTimestamp(curr);
      } catch (error) {
        console.log('new ads err: ', error);
      }
    }
    checkNewAds();



    // init SQLite dbs
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
    initSavedSearches()
      .then(() => {
        console.log("Saved searches DB initialize success");
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