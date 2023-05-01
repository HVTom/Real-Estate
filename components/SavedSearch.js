import React, { useContext } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
// saved searches context
import { SearchContext } from '../context/search-context';
// icon
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/styles';

const SavedSearch = ({ item }) => {
  const srchCtx = useContext(SearchContext);

  const deleteSavedSearch = () => {
    console.log(`Item with id ${item.id} deleted`);
    srchCtx.removeFavoriteSearch(item.id);
  }

  return (
    <View style={styles.savedItem} >
      {/* <Text>{item.id}</Text> */}
      <Text style={styles.location} >{item.location}</Text>
      <TouchableOpacity onPress={deleteSavedSearch}>
        <Feather name="trash" size={24} color={Colors.primaryRed} />
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  savedItem: {
    //
    //borderColor: 'black',
    //borderWidth: 1
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '7%',
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    //shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  location: {
    fontSize: 24,
  },
  icon: {},
});


export default SavedSearch;