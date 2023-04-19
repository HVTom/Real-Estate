import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
//icon
import { Feather } from '@expo/vector-icons';
//Colors
import { Colors } from '../constants/styles';


export const AccountBar = ({ iconName, iconSize, iconColor, text, action }) => {
  return (
    <TouchableOpacity onPress={action}>
      <View style={iconName != 'log-out' ? [styles.buttonView, styles.button] : [styles.buttonViewLogout, styles.button]}>
        <Feather style={styles.icon} name={iconName} size={iconSize} color={iconColor} />
        <Text style={iconName != 'log-out' ? styles.text : styles.textLogout}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  buttonView: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    alignItems: 'flex-start',
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
    marginLeft: '3%'
  },
  text: {
    marginLeft: '3%'
  },
  textLogout: {
    marginLeft: '3%',
    color: 'white'
  },
});