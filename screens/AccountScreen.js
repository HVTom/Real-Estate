import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, LogBox, Modal, Pressable, Switch, TextInput } from "react-native";
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
// modal screen
import UserListingsScreen from "./UserListingsScreen";
import { UserListingContext } from "../context/user-listing-context";
import { readUserAds } from '../util/userAds';
// Select List
import { SelectList, selectList } from 'react-native-dropdown-select-list';





const AccountScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [minVal, setMinVal] = useState();
  const [maxVal, setMaxVal] = useState();
  const [transaction, setTransaction] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [picture, setPicture] = useState();
  const [email, setEmail] = useState();
  const authContext = useContext(AuthContext);
  const [userAds, setUserAds] = useState([]);
  const userAdsContext = useContext(UserListingContext);


  // predefined list of types
  const transactionTypes = [
    { key: '1', value: 'Sale' },
    { key: '2', value: 'Rent' },
    { key: '3', value: 'Both' }
  ]


  const switchEditState = async () => {
    if (isEditing) {
      // Save minVal and maxVal to AsyncStorage
      try {
        await AsyncStorage.setItem("minVal", minVal);
        console.log(`${minVal} saved successfully to async storage.`);
        await AsyncStorage.setItem("maxVal", maxVal);
        console.log(`${maxVal} saved successfully to async storage.`);
        await AsyncStorage.setItem("transaction", transaction);
        console.log(`${transaction} saved successfully to async storage.`);
      } catch (error) {
        console.log("Error saving values:", error);
      }
    }
    setIsEditing(!isEditing);
  };



  useEffect(() => {
    const getBudgetValues = async () => {
      try {
        let minV = await AsyncStorage.getItem("minVal");
        console.log("Extracted min value: ", minV);
        setMinVal(minV);
        let maxV = await AsyncStorage.getItem("maxVal");
        console.log("Extracted min value: ", maxV);
        setMaxVal(maxV);
        let tsx = await AsyncStorage.getItem("transaction");
        console.log("Extracted transaction: ", tsx);
        setTransaction(tsx);
      } catch (error) {
        console.log("Couldn't extract minVal and MaxVal from lcoal storage. Reason: ", error);
      }
    }
    getBudgetValues();
  }, []);


  useEffect(() => {
    //console.log("userAdsContext.ads: ", userAdsContext.ads);

    async function fetchFromUserAds() {
      const response = await readUserAds(); // read from sqlite
      const responseIdsArray = response.rows._array;
      //console.log('Sqlite user ads: ', responseIdsArray);
      setUserAds(responseIdsArray);
    }
    fetchFromUserAds();
  }, [readUserAds, userAdsContext]);



  useEffect(() => {
    const getEmail = async () => {
      try {
        const mail = await AsyncStorage.getItem('email_addr');
        const Email = JSON.parse(mail);
        if (Email !== null) {
          console.log(`User has email ${Email}`);
          setEmail(Email);
        }
      } catch (e) {
        console.log("Error fetching user email");
      }
    }
    getEmail();
  }, []);


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
      <View style={styles.headerView}>
        <TouchableOpacity onPress={pickImage}>
          <Image style={styles.profilePic} source={picture != null ? { uri: picture } : require('../assets/logo-black.png')} />
        </TouchableOpacity>
        <Text style={styles.profileMail}>{email}</Text>
      </View>


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
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.buttonView}>
            <Feather style={styles.icon} name='tag' size={24} />
            <Text style={styles.text}>Your listings</Text>
            <Text style={styles.text}>{userAds.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Don't manually navigate when conditionally rendering screens
      like i did above; what will happen instead: when logout Button
      is pressed, the variable that conditionally renders screen groups
      will show the auth flow to the user! */}


      <View style={styles.budgetContainer}>
        <Text style={styles.budgetText}>Set budget limits</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.budgetInput}
            keyboardType="number-pad"
            editable={isEditing}
            placeholder={minVal}
            onChangeText={input => setMinVal(input)} //.trim()
            value={minVal}
          />
          <TextInput
            style={styles.budgetInput}
            keyboardType="number-pad"
            editable={isEditing}
            placeholder={maxVal}
            onChangeText={input => setMaxVal(input)} //.trim()
            value={maxVal}
          />
        </View>
        {/* add "im interested in sale/renting transaction type" if needed */}
        <View style={styles.transactionContainer} >
          <Text style={styles.budgetText}>I'm interseted in: </Text>
          <View style={styles.transactionContainer} pointerEvents={isEditing == false ? 'none' : 'auto'}>
            <SelectList 
              data={transactionTypes}
              setSelected={(input) => setTransaction(input)}
              save="value"
              placeholder={transaction}
              search={false}
              boxStyles={{
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 30,
                width: '30%',
                //marginLeft: '5%',
              }}
              dropdownStyles={{ borderWidth: 1, borderColor: 'black', width: '35%', alignSelf: 'center' }}
              disabled={isEditing}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={switchEditState}>
          {isEditing == true ? (<Feather name="check" size={24} color="green" />) : (<Feather name="edit-2" size={24} color={Colors.primaryPurple} />)}
        </TouchableOpacity>
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
    fontSize: 15,

  },
  button: {
    width: '50%',
    marginVertical: '5%',
    backgroundColor: Colors.primaryPurple,
    padding: '3%',
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'flex-end',

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
    marginVertical: '3%',
    // shadow and elevation 
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

  },
  buttonViewLogout: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.primaryPurple,
    alignItems: 'flex-start',
    padding: '3%',
    borderRadius: 5,
    marginVertical: '3%',
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
    color: 'white',
    fontSize: 18
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
    // shadow and elevation 
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
  // budget limits view
  budgetContainer: {
    backgroundColor: 'white',
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 20,
    // shadow and elevation 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  budgetText: {
    fontSize: 18,
    alignSelf: 'center',
    marginBottom: 10,
  },
  transactionText: {
    fontSize: 18,
    alignSelf: 'center',
    marginRight: '4%'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '5%'
  },
  budgetInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 30,
    width: '42%',
    height: 48,
    padding: '3%',
    fontSize: 18,
    textAlign: 'center'//
  },
  editButton: {
    alignSelf: 'center',
    marginTop: 20
  },

});

export default AccountScreen;