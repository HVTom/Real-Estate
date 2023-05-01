import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, LogBox, Modal, Pressable, Switch } from "react-native";
//icon
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
//auth context
import { AuthContext } from "../context/auth-context";
import { Colors } from "../constants/styles";
//image picker
import * as ImagePicker from 'expo-image-picker';
//local storage
import AsyncStorage from "@react-native-async-storage/async-storage";
//card with del button
import UserAdCard from "../components/UserAdCard";
//get the ads posted by the user
import { readUserAds } from "../util/userAds";
// modal screen
import UserListingsScreen from "./UserListingsScreen";


const AccountScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [picture, setPicture] = useState();
  const authContext = useContext(AuthContext);
  //currency toggle
  const [isEnabledCurrencySwitch, setIsEnabledCurrencySwitch] = useState(false);
  const toggleCurrencySwitch = () => setIsEnabledCurrencySwitch(!isEnabledCurrencySwitch);
  //units
  const [isEnabledSurfaceSwitch, setIsEnabledSurfaceSwitch] = useState(false);
  const toggleSurfaceSwitch = () => setIsEnabledSurfaceSwitch(!isEnabledSurfaceSwitch);
  //theme toggle
  const [isEnabledThemeSwitch, setIsEnabledThemeSwitch] = useState(false);
  const toggleThemeSwitch = () => setIsEnabledThemeSwitch(!isEnabledThemeSwitch);


  const onHandleLogout = () => {
    Alert.alert(
      "Log out",
      "Do you want to log out?",
      [
        {
          text: 'Cancel',
          style: 'destructive'
        },
        {
          text: 'Log out',
          onPress: () => authContext.logout(),
        }
      ]
    )
  }


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      meadiaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const pic = result.assets[0].uri;
      setPicture(pic);
      // console.log(result.assets[0].uri);
      storeProfilePic(pic)
    }
  }

  // store profile pic
  const storeProfilePic = async (value) => {
    try {
      await AsyncStorage.setItem("picture", value);
    } catch (error) {
      console.log("set error: ", error);
    }
  };


  // get profile pic
  useEffect(() => {
    const getUserPicture = async () => {
      try {
        const userData = await AsyncStorage.getItem("picture");
        setPicture(userData);
        // console.log("get: ", userData);
      } catch (error) {
        console.log("get error: ", error);
      }
    };
    getUserPicture();
  }, []);


  return (
    <View>
      {/*TODO: fetch user email from auth-provider <Text>Hello, {username}!</Text> */}
      <View style={styles.headerView}>
        <TouchableOpacity onPress={pickImage}>
          <Image style={styles.profilePic} source={picture != null ? { uri: picture } : require('../assets/logo-black.png')} />
        </TouchableOpacity>
        <Text style={styles.profileMail}>name@provider.com</Text>
      </View>

      {/* TODO: your listings opens user ads; make a card to represent data with deelete button; that delets both from realtime db and sqlite */}

      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <UserListingsScreen />
              <Pressable
                style={[styles.buttonModal, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <AntDesign name="closecircleo" size={28} color="black" />
              </Pressable>
            </View>
          </View>
        </Modal>
        {/*TODO: ad your listings button to open modal; put listings numbers o the button*/}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.buttonView}>
            <Feather style={styles.icon} name='tag' size={24} />
            <Text style={styles.text}>Your listings</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Don't manually navigate when conditionally rendering screens
      like i did above; what will happen instead: when logout Button
      is pressed, the variable that conditionally renders screen groups
      will show the auth flow to the user! */}



      {/*TODO: add currency switcher button*/}
      <View style={styles.buttonView}>
        <FontAwesome5 style={styles.icon} name="money-bill-alt" size={20} color="black" />
        <Text style={styles.text} >Currency</Text>
        <View style={styles.switchSide}>
          <MaterialIcons style={styles.icon} name="euro" size={24} color="black" />
          <Switch
            // trackColor={{ false: '#767577', true: '#81b0ff' }}
            // thumbColor={isEnabledCurrencySwitch ? '#f5dd4b' : '#f4f3f4'}
            // ios_backgroundColor="#3e3e3e"
            onValueChange={toggleCurrencySwitch}
            value={isEnabledCurrencySwitch}
          />
          <Feather style={styles.icon} name='dollar-sign' size={24} />
        </View>
      </View>


      {/*TODO: add measuring units switcher button*/}
      <View style={styles.buttonView}>
        <Feather style={styles.icon} name='maximize-2' size={24} />
        <Text style={styles.text} >Surface</Text>
        <View style={styles.switchSide}>
          <Text style={{ fontSize: 18, marginHorizontal: '3%' }} >Sqm</Text>
          <Switch
            // trackColor={{ false: '#767577', true: '#81b0ff' }}
            // thumbColor={isEnabledSurfaceSwitch ? '#f5dd4b' : '#f4f3f4'}
            // ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSurfaceSwitch}
            value={isEnabledSurfaceSwitch}
          />
          <Text style={{ fontSize: 18, marginHorizontal: '3%' }}>Mp</Text>
        </View>
      </View>


      {/*theme button*/}
      <View style={styles.buttonView}>
        <MaterialCommunityIcons style={styles.icon} name="theme-light-dark" size={24} color="black" />
        <Text style={styles.text} >Theme</Text>
        <View style={styles.switchSide}>
          <Feather style={styles.icon} name="sun" size={24} color="black" />
          <Switch
            //trackColor={{ false: '#767577', true: '#81b0ff' }}
            //thumbColor={isEnabledThemeSwitch ? '#f5dd4b' : '#f4f3f4'}
            //ios_backgroundColor="#3e3e3e"
            onValueChange={toggleThemeSwitch}
            value={isEnabledThemeSwitch}
          />
          <Feather style={styles.icon} name="moon" size={24} color="black" />
        </View>
      </View>

      <TouchableOpacity onPress={onHandleLogout}>
        <View style={[styles.buttonView, styles.buttonViewLogout]}>
          <Feather style={styles.iconLogout} name='log-out' size={24} color='white' />
          <Text style={styles.textLogout}>Log out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: '5%',
    // borderWidth: 1,
    // borderColor: 'black',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30
  },
  profileMail: {
    fontWeight: 'bold',
    fontSize: 16,

  },
  button: {
    width: '50%',
    marginVertical: '5%',
    backgroundColor: Colors.primaryPurple,
    padding: '3%',
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'flex-end'
  },
  logout: {
    marginTop: '7%',
  },
  //buttons styling
  buttonView: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '3%',
    borderRadius: 5,
    marginVertical: '3%'
  },
  buttonViewLogout: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.primaryPurple,
    alignItems: 'flex-start',
    padding: '3%',
    borderRadius: 5,
    marginVertical: '3%'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginHorizontal: '3%',
  },
  iconLogout: {
    marginHorizontal: '3%',
    color: 'white'
  },
  text: {
    marginHorizontal: '3%',
    fontSize: 18
  },
  textLogout: {
    marginLeft: '3%',
    color: 'white'
  },
  switchSide: {
    display: 'flex',
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 5
  },
  //modal styling
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '100%',
    height: '100%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: '7%' // modal goes up
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    //elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    padding: 5,
    marginTop: 5,
    marginBottom: -10,
    //shadowColor: 'white'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AccountScreen;