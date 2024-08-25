import React, { useState, useEffect,useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert,TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native';
import { View } from 'react-native';
import config from '../config/baseurl';

const { width } = Dimensions.get('window');

const CategoryMasala = () => {
    const [userEmail, setUserEmail] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const searchInputRef = useRef(null);
    const [trendingDeals, setTrendingDeals] = useState([
        { id: 13, image:{uri: 'https://i.ibb.co/ZJpy4RH/pcm.jpg'}, name: 'Panneer Chilly', price: '10.00', gram: '250 g', quantity: 1 },
        { id: 14, image:{uri: 'https://i.ibb.co/3vZ5trq/ccm.webp'}, name: 'Chilly Chicken', price: '15.00', gram: '250 g', quantity: 1 },
        { id: 15, image:{uri: 'https://i.ibb.co/xGkP9KX/c65.png'}, name: 'Chicken 65', price: '12.00', gram: '250 g', quantity: 1 },
        { id: 16, image:{uri: 'https://i.ibb.co/NZJZr3r/achar.png'}, name: 'Mirch Achar', price: '15.00', gram: '250 g', quantity: 1 },
        { id: 17, image:{uri: 'https://i.ibb.co/V2tRmxV/pizza.png'}, name: 'Pizza Chilli', price: '20.00', gram: '250 g', quantity: 1 },
        { id: 18, image:{uri: 'https://i.ibb.co/FHxXfLR/mc.png'}, name: 'Masala Chai', price: '15.00', gram: '250 g', quantity: 1 },
    ]);

    const filtertrendingdeals = trendingDeals.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    

    useEffect(() => {
        const getUserEmail = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                if (!userToken) {
                    Alert.alert('Error', 'User email not found. Please log in again.');
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
                const userEmail = userProfile.email;

                const favResponse = await fetch(`${config.baseURL}/fav`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                    },
                });

                if (!favResponse.ok) {
                    throw new Error('Failed to fetch favorite items');
                }

                const favItems = await favResponse.json();
                setFavorites(favItems);
            } catch (error) {
                console.error('Error retrieving favorites:', error);
                Alert.alert('Error', 'Error retrieving favorites');
            }
        };

        getUserEmail();
    }, []);

 const handleSearch = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };
    const handleIncreaseQuantity = (item) => {
        setTrendingDeals(prevDeals =>
            prevDeals.map(deal =>
                deal === item
                    ? { ...deal, quantity: deal.quantity + 1 }
                    : deal
            )
        );
    };

    const handleDecreaseQuantity = (item) => {
        setTrendingDeals(prevDeals =>
            prevDeals.map(deal =>
                deal === item && deal.quantity > 1
                    ? { ...deal, quantity: deal.quantity - 1 }
                    : deal
            )
        );
    };

    const handleAddToCart = async (item) => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (!userToken) {
                Alert.alert('Error', 'User email not found. Please log in again.');
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
            const userEmail = userProfile.email;
    
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
    
            const imageUri = typeof item.image === 'object' ? item.image.uri : item.image;
    
            const addToCartResponse = await fetch(`${config.baseURL}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    id: item.id,
                    email: userEmail,
                    image: imageUri,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
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
    
    const handleAddToFav = async (item) => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (!userToken) {
                Alert.alert('Error', 'User email not found. Please log in again.');
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
            const userEmail = userProfile.email;
    
            const itemInFav = favorites.find(favItem => favItem.id === item.id);
    
            if (itemInFav) {
                const removeFavResponse = await fetch(`${config.baseURL}/fav/remove`, {
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
    
                if (removeFavResponse.ok) {
                    setFavorites(favorites.filter(favItem => favItem.id !== item.id));
                } else {
                    Alert.alert('Failed', 'Failed to remove item from favorites');
                }
            } else {
                const imageUri = typeof item.image === 'object' ? item.image.uri : item.image;
    
                const addToFavResponse = await fetch(`${config.baseURL}/fav/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                    },
                    body: JSON.stringify({
                        id: item.id,
                        email: userEmail,
                        image: imageUri,
                        name: item.name,
                        price: item.price,
                        gram: item.gram,
                        quantity: item.quantity,
                    }),
                });
    
                if (addToFavResponse.ok) {
                    setFavorites([...favorites, item]);
                    // Alert.alert('Success', `Added ${item.name} to favorites`);
                } else {
                    Alert.alert('Failed', 'Failed to add item to favorites');
                }
            }
        } catch (error) {
            console.error('Error handling favorites:', error);
            Alert.alert('Error', 'Error handling favorites');
        }
    };
    


    const renderTrendingDeal = ({ item }) => {
        const isFavorite = favorites.some(favItem => favItem.id === item.id);
    
        return (
            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.addToFav}
                    onPress={() => handleAddToFav(item)}
                >
                    <Image
                        source={require('../assets/favheart.png')}
                        style={[styles.heartImage, { tintColor: isFavorite ? 'green' : 'gray' }]}
                    />
                </TouchableOpacity>
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardGram}>{item.gram}</Text>
                    <View style={styles.quantityContainer}>
                        <Text>Quantity</Text>
                        <TouchableOpacity onPress={() => handleDecreaseQuantity(item)}>
                            <Text style={styles.quantityButton}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => handleIncreaseQuantity(item)}>
                            <Text style={styles.quantityButton}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.cardPrice}>${item.price}</Text>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => handleAddToCart(item)}
                >
                    <Image source={require('../assets/card-icon.jpeg')} style={styles.addToCartImage} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.trendingDealsSection}>
        <View style={styles.searchContainer}>
                            <TextInput
                                ref={searchInputRef}
                                style={styles.searchInput}
                                placeholder="Search Item..."
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
                data={filtertrendingdeals}
                renderItem={renderTrendingDeal}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.trendingDealsContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    trendingDealsSection: {
        marginTop: 20,
        paddingBottom: 100,
    },
    trendingDealsHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginHorizontal: 5,
    },
    trendingDealsContainer: {
        paddingHorizontal: 5,
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
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    cardPrice: {
        fontSize: 12,
        fontWeight: "bold",
        color: '#06a845',
        position: 'absolute',
        top: 170,
        right: 8,
    },
    quantityButton: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 8,
        color: 'green',
    },
    quantityText: {
        fontSize: 14,
        color: 'green',
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
    heartImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    addToFav: {
        position: 'absolute', 
        top: 11,
        right: 16, 
        zIndex: 1, 
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
});

export default CategoryMasala;
