import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/baseurl';

const { width } = Dimensions.get('window');

const MyFavourite = () => {
  const [favourites, setFavourites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userEmail, setUserEmail] = useState(null);

  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken'); 
        if (!userToken) {
          Alert.alert('Error', 'User token not found. Please log in again.');
          return;
        }
  
        const response = await fetch(`${config.baseURL}/fav`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`, 
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch favourites');
        }
  
        const data = await response.json();
        setFavourites(data);
      } catch (error) {
        console.error('Error fetching favourites:', error);
      }
    };
  
    const getUserEmail = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          Alert.alert('Error', 'User token not found. Please log in again.');
          return;
        }
  
        const profileResponse = await fetch(`${config.baseURL}/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
  
        if (profileResponse.status !== 200) {
          throw new Error('Failed to fetch user profile');
        }
  
        const userProfile = await profileResponse.json();
        setUserEmail(userProfile.email);
        fetchFavourites(); 
      } catch (error) {
        console.error('Error retrieving user email:', error);
        Alert.alert('Error', 'Error retrieving user email');
      }
    };
  
    getUserEmail();
  }, []);
  
  const handleSearch = () => {
    if (searchInputRef.current) {
        searchInputRef.current.focus();
    }
};
  const handleAddToCart = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Error', 'User email not found. Please log in again.');
        return;
      }

      const cartResponse = await fetch(`${config.baseURL}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      });

      if (!cartResponse.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const cartItems = await cartResponse.json();
      const itemInCart = cartItems.find(cartItem => cartItem.id === item.id);

      if (itemInCart) {
        Alert.alert('Info', 'This item is already in your cart.');
        return;
      }

      const addToCartResponse = await fetch(`${config.baseURL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          id: item.id,
          email: userEmail,
          image: item.image,
          name: item.name,
          price: item.price,
          quantity: 1,
          gram: item.gram,
        }),
      });

      if (addToCartResponse.ok) {
        Alert.alert('Success', `Added ${item.name} to cart`);
      } else {
        Alert.alert('Failed', 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      Alert.alert('Error', 'Error adding item to cart');
    }
  };

  const handleRemoveFromFav = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        Alert.alert('Error', 'User email not found. Please log in again.');
        return;
      }

      const removeFromFavResponse = await fetch(`${config.baseURL}/fav/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          id: item.id,
          email: userEmail,
        }),
      });

      if (removeFromFavResponse.ok) {
        setFavourites(favourites.filter(favItem => favItem.id !== item.id));
        Alert.alert('Success', `Removed ${item.name} from favourites`);
      } else {
        Alert.alert('Failed', 'Failed to remove item from favourites');
      }
    } catch (error) {
      console.error('Error removing item from favourites:', error);
      Alert.alert('Error', 'Error removing item from favourites');
    }
  };

  const filteredFavourites = favourites.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardGram}>{item.gram}</Text>
        <Text style={styles.cardPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => handleAddToCart(item)}
      >
        <Image source={require('../assets/card-icon.jpeg')} style={styles.addToCartImage} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => handleRemoveFromFav(item)}
      >
        <Image source={require('../assets/favheart.png')} style={styles.heartImage} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search favourites..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                                <Image
                                    source={require('../assets/searchimage.jpg')}
                                    style={{ width: 20, height: 20, tintColor: 'black' }}
                                />
                            </TouchableOpacity>
      </View>
      <FlatList
        data={filteredFavourites}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.favouritesContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 25,
},
searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
},
searchButton: {
    backgroundColor: '#06a845',
    borderRadius: 5,
    padding: 10,
},
searchButtonText: {
    color: '#fff',
    fontSize: 16,
},
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 8,
    padding: 10,
    width: width * 0.43,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 130,
    borderRadius: 10,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#06a845',
    objectFit:"contain",
  },
  detailsContainer: {
    marginTop: 8,
    width: '100%',
    alignItems: 'flex-start',
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardGram: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: '#06a845',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartImage: {
    width: 24,
    height: 24,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartImage: {
    width: 24,
    height: 24,
  },
  favouritesContainer: {
    paddingHorizontal: 5,
  },
});

export default MyFavourite;
