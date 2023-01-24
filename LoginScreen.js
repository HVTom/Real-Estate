import React, { useContext, useState } from "react";
import { Button, View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
//icon
import { Feather } from '@expo/vector-icons';
import { Colors } from "../constants/styles";
//login function
import { login } from "../util/auth";
//auth context
import { AuthContext } from "../context/auth-context";


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authContext = useContext(AuthContext)

  const Login = async (email, password) => {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authContext.authenticate(token);
      setEmail('');
      setPassword('');
    } catch (error) {
      setIsAuthenticating(false);
      Alert.alert(
        'Auth failed',
        'Could not log in. Check your input.'
      )
    }
  }

  //TODO: reusable input ; toggle secret at password
  //TODO:
  // if(isAuthenticating) {
  //   return <LoadingSmthOverlay  logging in ../>
  // }


  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.top}>
          <Feather style={styles.icon} name="log-in" size={35} color={Colors.primaryPurple} />
          <Text style={styles.title}>Welcome Back!</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={input => setEmail(input)}
          value={email}
          autoCapitalize="none"
          autoComplete="off"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={input => setPassword(input)}
          value={password}
          autoCapitalize="none"
          autoComplete="off"
        />
        <TouchableOpacity style={styles.button} type='register' onPress={() => Login(email, password)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={styles.navigationText}>Don't have an account? Signup</Text>
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
  innerContainer: {
    width: '80%'
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    marginVertical: '5%',
    padding: '3%',
    fontSize: 18,
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
  navigationText: {
    alignSelf: 'center',
    marginVertical: '5%'
  }
});

export default LoginScreen;