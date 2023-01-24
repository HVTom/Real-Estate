import React, { useContext } from "react";
import { Button, View, Text, TouchableOpacity, StyleSheet } from "react-native";
//icon
import { Feather } from '@expo/vector-icons';
//auth context
import { AuthContext } from "../context/auth-context";
import { Colors } from "../constants/styles";


const AccountScreen = () => {
  const authContext = useContext(AuthContext);

  const Logout = () => {
    authContext.logout();
  }

  return (
    <View>
      <Text>AccountScreen</Text>
      {/* <Text>Hello, {username}!</Text> */}
      <Feather name="log-out" size={24} color={Colors.primaryPurple} />
      <TouchableOpacity style={styles.button} type='register' onPress={() => Logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
      {/* Don't manually navigate when conditionally rendering screens
      like i did above; what will happen instead: when logout Button
      is pressed, the variable that conditionally renders screen groups
      will show the auth flow to the user! */}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: '5%',
    backgroundColor: Colors.primaryPurple,
    padding: '5%',
    borderRadius: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
});

export default AccountScreen;