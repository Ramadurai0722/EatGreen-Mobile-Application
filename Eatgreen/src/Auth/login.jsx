import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Alert, Dimensions, Text, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/baseurl';

const Userlogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${config.baseURL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const token = await response.text();
        await AsyncStorage.setItem('userToken', token);

        Alert.alert('Login Successful');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Email or password incorrect');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };
  const handleGoogleLogin = () => {
    Alert.alert('Google login clicked');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Facebook login clicked');
  };

  const handleSignUp = () => {
    navigation.navigate('register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/vegetables.png')}
          style={styles.logo}
        />
        <View style={styles.imageOverlay} />
        <Image
          source={require('../assets/shoppinglogo.png')} 
          style={styles.icon}
        />
      </View>
      <ScrollView>
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Log In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <View style={{ ...styles.buttonWrapper, ...styles.button }}>
          <Button title="Log In" onPress={handleLogin} color="#06a845" />
        </View>

        <Text style={styles.orText}>or</Text>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Image
              source={require('../assets/google.png')}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Log in with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
            <Image
              source={require('../assets/facebook.png')}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Log in with Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
        </ScrollView>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: height * 0.3,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center', 
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 100, 0, 0.9)',
  },
  icon: {
    position: 'absolute',
    width: 200, 
    height: 200, 
    resizeMode: 'contain',
    top: '20%',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '105%',
    padding: 20,
    marginTop: -height * 0.00,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#06a845',
    backgroundColor: 'white',
  },
  buttonWrapper: {
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#06a845',
  },
  button: {
    marginVertical: 10,
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
    color: 'black',
  },
  socialButtonsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#06a845',
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: 'white',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: 'black',
  },
  signUpText: {
    textAlign: 'center',
    color: '#06a845',
    fontSize: 16,
    bottom: 0,
  },
});

export default Userlogin;
