import React, { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
// icon
import { Feather } from '@expo/vector-icons';
import { Colors } from "../constants/styles";
// register function
import { resetPassword } from "../util/auth";
// auth context
import { AuthContext } from "../context/auth-context";
// local storage for email address
import AsyncStorage from '@react-native-async-storage/async-storage';




const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const send = async (Email) => {
    try {
      Alert.alert(
        "Password Reset",
        `An email has been sent to ${Email}. Follow the instructions to reset your credentials.`,
        [
          {
            text: 'Cancel',
            style: 'destructive'
          },
          {
            text: 'OK',
            onPress: () => navigation.navigate('LoginScreen'),
          }
        ]
      )
      await resetPassword(Email);
    } catch (error) {
      console.log("Error sending reset password mail: ", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.top}>
          <Feather style={styles.icon} name="refresh-ccw" size={35} color={Colors.primaryPurple} />
          <Text style={styles.title}>Reset Password</Text>
        </View>
        <TextInput
          style={styles.inputMail}
          placeholder="Email"
          onChangeText={input => setEmail(input.trim())}
          value={email}
          autoCapitalize="none"
          autoComplete="off"
        />
        <TouchableOpacity style={styles.button} type='register' onPress={() => send(email)}>
          <Text style={styles.buttonText}>Send email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '80%'
  },
  icon: {
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    alignSelf: 'center'
  },
  top: {
    marginBottom: '40%'
  },
  inputMail: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    marginVertical: '5%',
    padding: '3%',
    fontSize: 18,
  },
  inputPassword: {
    width: '85%',
    height: '100%',
    marginVertical: '5%',
    padding: '3%',
    fontSize: 18,
  },
  passwordContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    height: 48,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  passwordIcon: {
    alignSelf: 'center',
    marginRight: '5%',
  },
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
  navigationTextContainer: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: '5%',
  },
  navigationText: {
    color: Colors.primaryPurple,
  }
});


export default ForgotPasswordScreen;