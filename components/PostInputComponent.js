import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export const PostInputComponent = ({ label, type, onPress }) => {
  const [value, setValue] = useState(0);
  if (type == 'text') {
    return (
      <View style={styles.labelInputContainer}>
        <Text>{label}</Text>
        <TextInput style={styles.textInput} />
      </View>
    )
  } else if (type == 'number') {
    return (
      <View style={styles.labelInputContainer}>
        <Text>{label}</Text>
        <TouchableOpacity onPress={() => setValue(value - 1)}>
          <Text style={styles.btn}>-</Text>
        </TouchableOpacity>
        <Text>{value}</Text>
        <TouchableOpacity onPress={() => setValue(value + 1)}>
          <Text style={styles.btn}>+</Text>
        </TouchableOpacity>
      </View>
    )
  }

}



const styles = StyleSheet.create({
  labelInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignContent: 'center'
  },
  textInput: {
    width: '70%',
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 30,
    marginVertical: '5%',
    padding: '3%',
    fontSize: 18,
  },
  numberButton: {

  },
  numberInput: {
    width: '2%',
    borderWidth: 2,
    borderColor: 'grey',
    width: '15%',
    paddingHorizontal: '3%',
    fontSize: 18,
  },
  btn: {
    fontSize: '20px',
  },
});


export default PostInputComponent;