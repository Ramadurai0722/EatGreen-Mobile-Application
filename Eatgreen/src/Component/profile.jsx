import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/baseurl';

const { width } = Dimensions.get('window');

const Profile = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [location, setLocation] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('login');
  };

  const handleUpdateProfile = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${config.baseURL}/user/update-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mobileNumber, location }),
      });

      if (response.status === 200) {
        const updatedUserData = await response.json();
        setUserProfile(updatedUserData);
        Alert.alert('Success', 'Profile updated successfully');
        setEditing(false);
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          Alert.alert('Error', 'No token found. Please log in again.');
          navigation.navigate('login');
          return;
        }

        const response = await fetch(`${config.baseURL}/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });

        if (response.status === 200) {
          const userData = await response.json();
          setUserProfile(userData);
          setName(userData.name);
          setMobileNumber(userData.mobileNumber);
          setLocation(userData.location);
        } else if (response.status === 403) {
          Alert.alert('Error', 'Unauthorized. Please log in again.');
          handleLogout();
        } else {
          console.log('Error:', response.status);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Image
            source={require('../assets/logout.jpg')}
            style={{ width: 40, height: 40, tintColor: 'red' }}
          />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Profile</Text>
          <Image
            source={require('../assets/profile.png')}
            style={styles.profileImage}
          />
          {editing ? (
            <>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="Mobile Number"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Location"
              />
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                <Text style={styles.updateButtonText}>Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.profileText}>Name: {userProfile.name}</Text>
              <Text style={styles.profileText}>Email: {userProfile.email}</Text>
              <Text style={styles.profileText}>Mobile Number: {userProfile.mobileNumber}</Text>
              <Text style={styles.profileText}>Location: {userProfile.location}</Text>
              <TouchableOpacity style={styles.updateButton} onPress={() => setEditing(true)}>
                <Text style={styles.updateButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {(!keyboardVisible) && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.myOrdersButton, { width: width * 0.9 }]}
            onPress={() => navigation.navigate('myorder')}
          >
            <Text style={styles.myOrdersButtonText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.backToHomeButton, { width: width * 0.9 }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.backToHomeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 3,
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 1,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: width * 0.9,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 40,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#06a845',
    marginBottom: 10,
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#388E3C',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  myOrdersButton: {
    backgroundColor: '#fff',
    borderColor: '#06a845',
    borderWidth: 2,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  myOrdersButtonText: {
    fontSize: 18,
    color: '#06a845',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backToHomeButton: {
    backgroundColor: '#06a845',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  backToHomeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
  },
  input: {
    width: width * 0.7,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default Profile;
