import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// icon
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Colors } from '../constants/styles';



const SearchBar = ({ term, onTermChange, onTermSubmit }) => {

  return (
    // <View style={styles.parentContainer} >
    <View style={styles.barContainer}>
      <MaterialIcons name="search" size={24} color="black" style={styles.iconSearch} />
      <TextInput
        placeholder='Search'
        value={term}
        onChangeText={input => onTermChange(input.trim())}
        style={styles.input}
        onEndEditing={() => onTermSubmit()}
        cursorColor={Colors.primaryPurple}
      />
      <TouchableOpacity onPress={() => onTermChange('')}>
        {term.length > 0 ? (<MaterialIcons name="close" size={24} color="black" />) : null}
      </TouchableOpacity>
    </View>
    // </View>
  )
}


const styles = StyleSheet.create({
  parentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 3,
  },
  barContainer: {
    // borderColor: 'black',
    // borderWidth: 1,

    backgroundColor: '#D8D8D8',
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    width: '75%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  iconSearch: {
    marginLeft: '5%'
  },
  input: {
    //borderWidth: 1,
    //borderColor: 'red',
    width: '70%',
    height: '100%',
    marginHorizontal: 5,
    fontSize: 20
  },
  filter: {
    alignSelf: 'center',
    marginRight: 5,
    marginLeft: 5,
  },
});


export default SearchBar
