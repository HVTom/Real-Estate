import React, { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
//icon
import { Feather } from '@expo/vector-icons';
import { Colors } from "../constants/styles";
//register function
import { createUser } from "../util/auth";
//auth context
import { AuthContext } from "../context/auth-context";


const SignupScreen = ({ navigation }) => {
  const [visiblePassword, setVisiblePassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authContext = useContext(AuthContext);

  const Register = async (email, password) => {
    setIsAuthenticating(true);
    try {
      const token = await createUser(email, password);
      authContext.authenticate(token);
      setEmail('');
      setPassword('');
    } catch (error) {
      setIsAuthenticating(false);
      Alert.alert(
        'Auth failed',
        'Check your input.'
      )
    }
  }


  //TODO: if(isAuthenticating) {
  //   return <LoadingSpinnerSmth />
  // }


  const toggleIcon = () => {
    setVisiblePassword(!visiblePassword);
  }


  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.top}>
          <Feather style={styles.icon} name="user-plus" size={35} color={Colors.primaryPurple} />
          <Text style={styles.title}>Create New Account</Text>
        </View>
        <TextInput
          style={styles.inputMail}
          placeholder="Email"
          onChangeText={input => setEmail(input.trim())}
          value={email}
          autoCapitalize="none"
          autoComplete="off"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            onChangeText={input => setPassword(input.trim())}
            value={password}
            autoCapitalize="none"
            autoComplete="off"
            secureTextEntry={visiblePassword}
          />
          <TouchableOpacity style={styles.passwordIcon} onPress={toggleIcon}>
            {visiblePassword ? (<Feather name="eye" size={24} color="black" />) : (<Feather name="eye-off" size={24} color="black" />)}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} type='register' onPress={() => Register(email, password)}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.navigationTextContainer}>
          <Text>Got an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.navigationText}>Login</Text>
          </TouchableOpacity>
        </View>
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


export default SignupScreen;