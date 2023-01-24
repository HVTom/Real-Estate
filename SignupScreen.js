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


  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.top}>
          <Feather style={styles.icon} name="user-plus" size={35} color={Colors.primaryPurple} />
          <Text style={styles.title}>Create New Account</Text>
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
        <TouchableOpacity style={styles.button} type='register' onPress={() => Register(email, password)}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.navigationText}>Got an account? Login</Text>
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
    width: '80%',
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
    paddingVertical: '5%'
  }
});


export default SignupScreen;