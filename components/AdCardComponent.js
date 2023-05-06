import React, { useState, useContext } from 'react'
import { View, Text, Image, StyleSheet, Pressable, TouchableOpacity, Modal } from 'react-native';
// icons
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/styles';
import ExtendedDetailScreen from '../screens/ExtendedDetailScreen';
// context
import { FavoriteContext } from '../context/favorite-context';




const AdCardComponent = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [favorite, setFavorite] = useState();
  const favContext = useContext(FavoriteContext);


  const toggleFavorite = () => {
    setFavorite(!favorite);
    if (!favorite) {
      favContext.addFavoriteAd(item.id);
      console.log("Saved to favorites context");
    } else {
      //TODO: check if screen is focused
      favContext.removeFavoriteAd(item.id);
      console.log("Removed from favorites context");
    }
  }


  return (
    <View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ExtendedDetailScreen estateData={item} onClose={() => setModalVisible(!modalVisible)} />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <AntDesign name="closecircleo" size={28} color="black" />
            </Pressable>
          </View>
        </View>
        {/*modal as a screen - for extended details*/}
      </Modal>
      <View style={styles.pressableView}>
        <Pressable android_ripple={{ color: '#ccc', borderless: false, overflow: 'hidden' }} onPress={() => setModalVisible(!modalVisible)}>
          <View style={item.type == 'Eco' ? styles.ecoItemContainer : styles.itemContainer} >
            <Image source={{ uri: `data:image;base64,${item.images[0].b64}` }}
              style={{ width: 325, height: 200, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
            />
            <View style={styles.moneyDetail}>
              <MaterialIcons name="euro" size={24} color="black" />
              {item.transaction === 'Rent' ? <Text style={{ fontSize: 24, fontWeight: 'bold', marginLeft: 5 }}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/mo</Text> : <Text style={{ fontSize: 24, fontWeight: 'bold', marginLeft: 5 }}>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>}
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detail}>
                <SimpleLineIcons name="size-fullscreen" size={18} color="black" style={styles.icon} />
                <Text style={styles.text}>{item.surface}mp</Text>
              </View>
              <View style={styles.detail}>
                {item.type == 'Land' || item.type == 'Comercial' ? null : (<View style={styles.detail}><MaterialCommunityIcons name="bed-outline" size={18} color="black" style={styles.icon} />
                  <Text style={styles.text}>{item.bedrooms}</Text></View>)}
              </View>
              <View style={styles.detail}>
                {item.type == 'Land' || item.type == 'Comercial' ? null : (<View style={styles.detail}><MaterialCommunityIcons name="shower" size={18} color="black" style={styles.icon} />
                  <Text style={styles.text}>{item.bathrooms}</Text></View>)}
              </View>
              <View style={styles.detail}>
                <Text style={[styles.text, { color: Colors.primaryPurple, borderWidth: 1, borderColor: Colors.primaryPurple, paddingHorizontal: 3 }]}>{item.transaction}</Text>
              </View>
            </View>
            <Text style={styles.text}>{item.type}</Text>
            <View style={styles.bottomDetail}>
              <Text>{item.location}</Text>
              <Pressable onPress={toggleFavorite}>
                {favorite ? <AntDesign name="heart" size={24} color="red" /> : <AntDesign name="hearto" size={24} color="red" />}
              </Pressable>
            </View>
          </View>
        </Pressable>
      </View >
    </View >
  )
}


const styles = StyleSheet.create({
  ecoItemContainer: {
    marginVertical: 10,
    marginHorizontal: 18,
    marginBottom: 10,
    backgroundColor: '#eefaed',
    borderRadius: 15,
    // shadows
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden'
  },
  itemContainer: {
    marginVertical: 10,
    marginHorizontal: 18,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    // shadows
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden'
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 5,
    overflow: 'hidden',
    justifyContent: 'space-between',
    marginHorizontal: -5
  },
  text: {
    marginLeft: 10,
    marginRight: 15,
  },
  moneyDetail: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  priceTranx: {
    justifyContent: 'space-between'
  },
  detail: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5
  },
  icon: {
    marginRight: -5,
  },

  bottomDetail: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10
  },
  pressableView: {
    borderRadius: 15,
    overflow: 'hidden',
    margin: 0
  },

  // modal 
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
    marginBottom: '10%' // modal goes up
  },
  button: {
    //borderRadius: 20,
    //padding: 10,
    //elevation: 2,
  },
  buttonOpen: {
    //backgroundColor: '#F194FF',
  },
  buttonClose: {
    //backgroundColor: '#7c24c4',
    padding: 5,
    marginTop: 5,
    marginBottom: -10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});


export default AdCardComponent;