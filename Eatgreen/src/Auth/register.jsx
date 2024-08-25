import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Alert, Dimensions, Text, TouchableOpacity, ScrollView } from 'react-native';
import config from '../config/baseurl';

const Userregister = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [location, setLocation] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch(`${config.baseURL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, mobileNumber, location }),
      });

      if (response.ok) {
        navigation.navigate('login');
        Alert.alert('Registration successful');
      } else {
        const errorMessage = await response.text();
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to register. Check your network connection.');
    }
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
      <View style={styles.formContainer}>
        <Text style={styles.heading}>Sign Up</Text>
        <ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          onChangeText={(text) => setMobileNumber(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          onChangeText={(text) => setLocation(text)}
        />
        <View style={{ ...styles.buttonWrapper, ...styles.button }}>
          <Button title="Sign Up" onPress={handleRegister} color="#06a845" />
        </View></ScrollView>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('login')}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
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
    width: '100%',
    padding: 20,
    marginTop: -height * 0.00,
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
    width: '100%',
  },
  signInText: {
    textAlign: 'center',
    color: '#06a845',
    fontSize: 16,
    bottom: 9,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Userregister;
