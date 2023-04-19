import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Button, TouchableOpacity } from 'react-native'
// icons
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// using map locally instead of component; component gives error
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
//Linking - for opening native apps
import { Linking } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';



const TOKEN = 'pk.eyJ1IjoidGhvbTIzIiwiYSI6ImNreHE1dGlheTJla2syeXFrMDh6bWVubmMifQ.FJI_I_aW5GQakRPeLsfNjg';


const ExtendedDetailScreen = ({ estateData, onClose }) => {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);


  const address = estateData.location;

  useEffect(() => {
    const fetchCoords = async (address) => {
      try {
        //forward geocoding
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${TOKEN}&limit=1`);
        let longitude = await response.data.features[0].center[0]
        let latitude = await response.data.features[0].center[1]
        setLat(latitude);
        setLon(longitude);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCoords(address);
  }, [])

  // console.log("lat: ", lat);
  // console.log("lon", lon);

  const markerLocation = {
    latitude: lat,
    longitude: lon,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  }

  const makeCall = async (phone) => {
    try {
      await Linking.openURL(`tel:${phone}`)
    } catch (error) {
      console.log(error);
    }
  }


  const sendMail = async (mail) => {
    try {
      await Linking.openURL(`mailto:${mail}?subject=Info about '${estateData.title}'&body=Hello! I'm interested in this ad.`);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <View style={styles.page}>
      <View style={styles.topIcons} >
        {/* <Pressable android_ripple={{ color: '#ccc}' }} onPress={onClose}>
          <AntDesign name="back" size={24} color="black" style={styles.icon} />
        </Pressable> */}
        {/* <Text style={styles.title}>{estateData.title}</Text> */}
        {/* <Pressable onPress={toggleFavorite}>
          {favorite ? <AntDesign name="heart" size={24} color="red" style={styles.icon} /> : <AntDesign name="hearto" size={24} color="red" style={styles.icon} />}
        </Pressable> */}
      </View>
      <Text style={styles.title}>{estateData.title}</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.parentScroll} >
        {/*image gallery*/}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled={true}>
          {estateData.images.map((item) => {
            return (
              <View key={Math.floor(1000 + Math.random() * 9000)} style={{ alignSelf: 'center', marginVertical: 10 }} >
                <Image source={{ uri: `data:image;base64,${item.b64}` }} style={{ width: 320, height: 200, borderRadius: 15 }} />
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.moneyDetail}>
          <MaterialIcons name="euro" size={20} color="black" />
          <Text style={styles.priceText}>{estateData.price}</Text>
        </View>

        <Text style={styles.dividerText}>Main Data</Text>

        <View style={estateData.type == 'Land' || estateData.type == 'Comercial' ? styles.fewerMainDetail : styles.mainDetail}>
          <View style={styles.detail}>
            <SimpleLineIcons name="size-fullscreen" size={20} color="black" style={styles.icon} />
            <Text>{estateData.surface}mp</Text>
          </View>

          <View style={styles.detail}>
            {estateData.type == 'Land' || estateData.type == 'Comercial' ? null : (<View style={styles.detail}><MaterialCommunityIcons name="bed-outline" size={18} color="black" style={styles.icon} />
              <Text style={styles.text}>{estateData.bedrooms}</Text></View>)}
          </View>
          <View style={styles.detail}>
            {estateData.type == 'Land' || estateData.type == 'Comercial' ? null : (<View style={styles.detail}><MaterialCommunityIcons name="shower" size={18} color="black" style={styles.icon} />
              <Text style={styles.text}>{estateData.bathrooms}</Text></View>)}
          </View>

          <View style={styles.detail}>
            {/*conditional rendering*/}
            <Text>{estateData.type}</Text>
          </View>
        </View>

        <View style={[styles.detail, styles.description]}>
          <Feather name="file-text" size={20} color="black" style={styles.icon} />
          <Text>Description</Text>
        </View>
        <Text style={styles.detail}>{estateData.description}</Text>

        {/*location*/}

        <View style={styles.container}>
          {/* Extract Map to component */}
          {/*add dark mode*/}
          <MapView
            // for dark mode customMapStyle={mapStyle}
            showsPointsOfInterest
            showsBuildings
            zoomControlEnabled
            scrollEnabled={false}
            region={{
              latitude: lat,
              longitude: lon,
              latitudeDelta: 0.03,
              longitudeDelta: 0.01,
            }}
            style={styles.map}
          >
            <Marker key={estateData.id} coordinate={markerLocation} />
          </MapView>
        </View>


        <View style={styles.contactSection}>
          <Text style={styles.dividerText}>Contact</Text>

          <View style={[styles.detail, styles.button]}>
            <Feather name="phone" size={20} color="white" style={styles.bottomIcon} />
            <TouchableOpacity onPress={() => { makeCall(estateData.phone) }} >
              <Text style={styles.buttonText}>{estateData.phone}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.detail, styles.button]}>
            <Feather name="mail" size={20} color="white" style={styles.bottomIcon} />
            <TouchableOpacity onPress={() => { sendMail(estateData.email) }} >
              <Text style={styles.buttonText}>{estateData.email}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.detail, styles.location]}>
            <Feather name="map-pin" size={20} color="black" style={styles.bottomIcon} />
            <Text>Location: {estateData.location}</Text>
          </View>
        </View>


      </ScrollView >
    </View >
  );
}


const styles = StyleSheet.create({
  page: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    marginHorizontal: 0,
    padding: 0
  },
  parentScroll: {
    flex: 1,
  },
  topIcons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    alignSelf: 'center',
    marginBottom: 10,
    marginHorizontal: 20
  },
  icon: {
    marginRight: 2
  },
  bottomIcon: {
    marginRight: 10
  },
  moneyDetail: {
    marginVertical: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  priceText: {
    fontSize: 30,
    display: 'flex',
  },
  detail: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5
  },
  fewerMainDetail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10
  },
  mainDetail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
  location: {
    alignSelf: 'center',
    marginVertical: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  dividerText: {
    fontSize: 26,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  description: {
    display: 'flex',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  //map
  container: {
    flex: 1,
    marginTop: 20,
  },
  map: {
    width: '100%',
    height: 300,
  },
  //contact section
  contactSection: {
    marginTop: 10,
    marginBottom: 30
  },
  //butons
  button: {
    backgroundColor: '#7c24c4',
    marginVertical: 15,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    borderRadius: 15,
    elevation: 10,
    shadowOpacity: 0.5
  },
  buttonText: {
    color: 'white',
    fontSize: 18
  },
});


export default ExtendedDetailScreen;