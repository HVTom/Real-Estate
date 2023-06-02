import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, VirtualizedList, Image, TouchableOpacity, ScrollView, LogBox, Alert } from "react-native";
// Colors
import { Colors } from "../constants/styles";
// Expo camera 
import * as ImagePicker from 'expo-image-picker';
// ignore cancelled/canceled warning
LogBox.ignoreLogs(['cancelled']);
// base64 encoder/decoder for media upload
import { decode } from "base-64";
// Realtime Database
import { getRealtimeDbData, writeUserData } from "../util/firebaseConfig";
// Select List
import { SelectList, selectList } from 'react-native-dropdown-select-list';
// import function to persist posted ad
import { insertUserAds } from "../util/userAds";
import { UserListingContext } from "../context/user-listing-context";


// for base64 encoding
if (typeof atob === 'undefined') {
  global.atob = decode;
}


const AddEstateScreen = () => {
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState('');
  const [surface, setSurface] = useState('');
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [type, setType] = useState('');
  const [transaction, setTransaction] = useState('');
  const [year, setYear] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // const userListingContext = useContext(UserListingContext); //??? unused??



  // predefined list of types
  const estateTypes = [
    { key: '1', value: 'House' },//5
    { key: '2', value: 'Apartment' }, //2
    { key: '3', value: 'Duplex' }, //3
    { key: '4', value: 'Comercial' },
    { key: '5', value: 'Land' },//6
    { key: '6', value: 'Villa' },//7
    { key: '7', value: 'Residential Complex' },//4
    { key: '8', value: 'Eco' } //1
  ]

  // predefined list of types
  const transactionTypes = [
    { key: '1', value: 'Sale' },
    { key: '2', value: 'Rent' }
  ]


  // image picker
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      meadiaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
      duration: false,
      exif: false,
    });

    //console.log('selcted images: \n', result);
    //console.log("image id: \n", result.assets[0].assetId);
    //console.log("image uri: \n", result.assets[0].uri);

    if (!result.canceled) {
      //setImage(result.assets[0].uri);
      //console.log("assets length:", result.assets.length)
      // result.assets.forEach(item => {
      //   let img = { assetId: item.assetId, uri: item.uri, b64: item.base64 };
      //   setImages([...images, img]);
      // })
      for (let i = 0; i < result.assets.length; i++) {
        //let img = { assetId: null, uri: null };
        let img = { assetId: result.assets[i].assetId, b64: result.assets[i].base64 };
        // if (img.assetId == null) { TODO: use the random id for the estate id; save id to async storage to save user posted ads (getting user data doesn't work)
        //   img.assetId = Math.floor(100000 + Math.random() * 900000);
        // }
        setImages([...images, img]);
      }
    }
  }


  // generate id for ad
  const generateAdId = () => {
    // generate a 6 digit number
    let id = 0;
    id = Math.floor(100000 + Math.random() * 900000);
    return id;
  }

  // generate timestamp
  const generateTimestamp = () => {
    let uploadTime = Date.now();
    return uploadTime;
  }

  // don't let the user select a value under 0
  if (beds < 0) {
    setBeds(0);
  }
  if (baths < 0) {
    setBaths(0);
  }


  // form validation
  let validated = true; // TODO: fix validation
  const onSubmit = () => {
    // check phone number 0768244870
    if (phone.substring(0, 2) != "07" || phone.length != 10) {
      Alert.alert(
        "Ivalid phone number",
        "Inavlid number prefix or invalid length. Check your number.",
        [
          {
            text: 'OK',
            style: 'destructive'
          }
        ]
      )
    }

    // email validation
    if (!email.includes('@') || !email.endsWith('.com')) {
      Alert.alert(
        "Ivalid email",
        "Wrong email. Check your email address.",
        [
          {
            text: 'OK',
            style: 'destructive'
          }
        ]
      )
    }


    // verify if mandatory fields are filled depending on the estate type
    // if ((type === "Comercial" || type === "Land") && (beds == 0 || baths == 0) && ((title.length == 0) || (price.length == 0) || (surface.length < 0) ||
    //   (type.length == 0) || (year.length == 0) || (desc.length == 0) || (location.length == 0) || (phone.length == 0) ||
    //   (email.length == 0) || (images.length == 0))) {
    //   validated = false;
    // }
    // if ((type === "Comercial" || type === "Land") && (beds == 0 || baths == 0) && ((title.length != 0) || (price.length != 0) || (surface.length < 0) ||
    //   (type.length != 0) || (year.length != 0) || (desc.length == 0) || (location.length != 0) || (phone.length != 0) ||
    //   (email.length != 0) || (images.length != 0))) {
    //   validated = true;
    // }
    // if ((type !== "Comercial" || type !== "Land") && ((beds == 0) || (baths == 0) && (title.length == 0) || (price.length == 0) || (surface.length < 0) ||
    //   (type.length == 0) || (year.length == 0) || (desc.length == 0) || (location.length == 0) || (phone.length == 0) ||
    //   (email.length == 0) || (images.length == 0))) {
    //   validated = false;
    // }

    if (!validated) {
      Alert.alert(
        "Empty field",
        "One of the fields is empty or no picture was selected. Check your inputs.",
        [
          {
            text: 'OK',
            style: 'destructive'
          }
        ]
      )
    }

    if (validated) {
      const id = generateAdId();
      const timestamp = generateTimestamp();
      //console.log(timestamp);
      // console.log("generated id: ", id);
      // persist user ads
      const image = images[0].b64; // insert only the first ad image

      // realtime db write
      writeUserData(id, title, price, surface, beds, baths, type, transaction, year, desc, location, phone, email, images, timestamp);
      Alert.alert(
        "Uploaded",
        "Ad uploaded successfully.",
        [
          {
            text: 'OK',
            style: 'destructive'
          }
        ]
      )
      // insert to user ads sqlite db
      insertUserAds(id, title, price, surface, beds, baths, type, transaction, year, desc, location, phone, email, images[0].b64);
      // clear fields for next upload
      // setTitle('');
      setImages([]);
      // setPrice('');
      // setSurface('');
      // setBeds(0);
      // setBaths(0);
      // setType('');
      // setTransaction('');
      // setYear('');
      // setDesc('');
      // setLocation('');
      // setPhone('');
      // setEmail('');
    }
  }



  return (
    <ScrollView>
      {/*Title*/}
      <View style={styles.shadowCard}>
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Ad title'
            onChangeText={input => setTitle(input)}
            value={title}
          />
        </View>
      </View>

      <Text style={styles.sectionText}>Base Information</Text>
      <View style={styles.shadowCard}>
        <TouchableOpacity style={styles.button} onPress={pickImages}>
          <Text style={styles.buttonText}>Select Images</Text>
        </TouchableOpacity>
        {images.map((item) => {
          return (
            <View key={Math.floor(1000 + Math.random() * 9000)} style={{ alignSelf: 'center', marginVertical: '1%' }} >
              <Image source={{ uri: `data:image;base64,${item.b64}` }} style={{ width: 300, height: 150, borderRadius: 15 }} />
            </View>
          );
        })}
      </View>
      {/*Price*/}
      <View style={styles.shadowCard}>
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.textInput}
            keyboardType='phone-pad'
            placeholder='$amount'
            onChangeText={input => setPrice(parseInt(input))} //TODO: remove parsing if necessary
            value={price}
          />
        </View>
        {/*Surface*/}
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Surface</Text>
          <TextInput
            style={styles.textInput}
            keyboardType='phone-pad'
            placeholder='x m^2'
            onChangeText={input => setSurface(input)}
            value={surface}
          />
        </View>
        {/*Bedrooms*/}
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Bedrooms</Text>
          <View style={styles.numberInputContainer}>
            <TouchableOpacity onPress={() => setBeds(beds - 1)}>
              <Text style={styles.numberInputButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.numberInput}>{beds}</Text>
            <TouchableOpacity onPress={() => setBeds(beds + 1)}>
              <Text style={styles.numberInputButton}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/*Baths*/}
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Bathrooms</Text>
          <View style={styles.numberInputContainer}>
            <TouchableOpacity onPress={() => setBaths(baths - 1)}>
              <Text style={styles.numberInputButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.numberInput}>{baths}</Text>
            <TouchableOpacity onPress={() => setBaths(baths + 1)}>
              <Text style={styles.numberInputButton}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.sectionText}>Extended Information</Text>
      <View style={styles.shadowCard}>
        {/*Estate type*/}
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Estate type</Text>
          <SelectList
            data={estateTypes}
            setSelected={(input) => setType(input)}
            save="value"
            placeholder="Select estate type"
            search={false}
            boxStyles={{
              borderWidth: 2, borderColor: 'black', borderRadius: 30,
              width: '55%', marginVertical: '5%', marginLeft: '20%',
              marginRight: '5%'
            }}
            dropdownStyles={{ borderWidth: 2, borderColor: 'black', width: '53%', alignSelf: 'center' }}
          />
        </View>
        {/*Transaction type*/}
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Transaction type</Text>
          <SelectList
            data={transactionTypes}
            setSelected={(input) => setTransaction(input)}
            save="value"
            placeholder="Select Transaction type"
            search={false}
            boxStyles={{
              borderWidth: 2, borderColor: 'black', borderRadius: 30,
              width: '50%', marginVertical: '5%', marginLeft: '20%',
              marginRight: '5%'
            }}
            dropdownStyles={{ borderWidth: 2, borderColor: 'black', width: '35%', alignSelf: 'center' }}
          />
          <Text style={styles.label}>{transaction}</Text>
        </View>
        {/*Year Built*/}
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Year Built</Text>
          <TextInput
            style={styles.textInput}
            keyboardType='phone-pad'
            placeholder='Year'
            onChangeText={input => setYear(input)}
            value={year}
          />
        </View>
        {/*Description*/}
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            placeholder='Details that help describe and sell the estate'
            onChangeText={input => setDesc(input)}
            value={desc}
          />
        </View>
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.textInput}
            placeholder='County, City, Country'
            onChangeText={input => setLocation(input.trim())}
            value={location}
          />
        </View>
      </View>
      {/*Contact*/}
      <Text style={styles.sectionText}>Contact</Text>
      <View style={styles.shadowCard}>
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.textInput}
            keyboardType='phone-pad'
            placeholder="07xxxxxxxx"
            onChangeText={input => setPhone(input)}
            value={phone}
          />
        </View>
        <View style={styles.labelInputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInput}
            autoCapitalize='none'
            autoComplete='off'
            autoCorrect={false}
            placeholder='name@provider.com'
            onChangeText={input => setEmail(input.trim())}
            value={email}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => onSubmit()}>
        <Text style={styles.buttonText}>Post ad</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  //container for both the label and text input
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: '-5%'
  },
  labelInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '10%',
    alignItems: 'center',
    alignContent: 'center',
  },
  textInput: {
    width: '60%',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 30,
    marginVertical: '5%',
    marginRight: '-5%',
    padding: '3%',
    fontSize: 18,
  },
  //container for both the label and the number input
  numberInputContainer: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: '5%',
    padding: '3%',
    fontSize: 18,
    marginRight: '-5%',
  },
  numberInput: {
    width: '2%',
    borderWidth: 2,
    borderRadius: 30,
    borderColor: 'black',
    width: '60%',
    padding: '3%',
    marginHorizontal: '10%',
    fontSize: 18,
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  // - / + buttons
  numberInputButton: {
    fontSize: 24,
    borderWidth: 2,
    borderRadius: 30,
    textAlign: 'center',
    padding: '5%'
  },
  sectionCard: {},
  sectionText: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: '15%',
    marginBottom: '1%'
  },
  button: {
    //marginTop: '15%',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: '50%',
    marginVertical: '15%',
    backgroundColor: Colors.primaryPurple,
    padding: '3%',
    borderRadius: 30,
    //
    elevation: 3, // Add elevation for shadow effect
    // shadowColor: 'black', // Customize the shadow color
    // shadowOffset: { width: 0, height: 2 }, // Customize the shadow offset
    //
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,

  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  shadowCard: {
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 10,
    marginHorizontal: '2%',
    backgroundColor: 'white',
    marginVertical: '7%',
  }
});


export default AddEstateScreen;