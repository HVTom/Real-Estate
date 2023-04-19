import React from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// icon
import { MaterialIcons } from '@expo/vector-icons';



const SearchBar = ({ term, onTermChange, onTermSubmit }) => {


  return (
    <View style={styles.barContainer}>
      <MaterialIcons name="search" size={24} color="black" style={styles.iconSearch} />
      <TextInput
        placeholder='Search'
        value={term}
        onChangeText={input => onTermChange(input)}
        style={styles.input}
        onEndEditing={() => onTermSubmit()}
      />
      <TouchableOpacity onPress={() => onTermChange('')}>
        {term.length > 0 ? (<MaterialIcons name="close" size={24} color="black" />) : null}
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  barContainer: {
    // borderColor: 'black',
    // borderWidth: 1,

    backgroundColor: '#D8D8D8',
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 15,
  },
  iconSearch: {
    marginLeft: '5%'
  },
  input: {
    // borderWidth: 1,
    // borderColor: 'red',

    width: '75%',
    height: '100%',
    marginHorizontal: 5,
    fontSize: 20
  },
});


export default SearchBar
