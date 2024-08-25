import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions, Alert, ActivityIndicator, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/baseurl';

const { width } = Dimensions.get('window');

const Checkout = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('');
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                if (!userToken) {
                    Alert.alert('Error', 'User token not found. Please log in again.');
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

                const items = await cartResponse.json();
                setCartItems(items);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                Alert.alert('Error', 'Error fetching cart items');
            } finally {
                setLoading(false);
            }
        };

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
                } else if (response.status === 403) {
                    Alert.alert('Error', 'Unauthorized. Please log in again.');
                    await AsyncStorage.removeItem('userToken');
                    navigation.navigate('login');
                } else {
                    throw new Error(`Error: ${response.status}`);
                }
            } catch (error) {
                console.error('Profile fetch error:', error);
                Alert.alert('Error', 'Failed to fetch user profile');
            }
        };

        fetchCartItems();
        fetchUserProfile();
    }, []);

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const renderCheckoutItem = ({ item }) => (
        <View style={styles.checkoutItem}>
            <Image source={{ uri: item.image }} style={styles.checkoutItemImage} />
            <View style={styles.checkoutItemDetails}>
                <Text style={styles.checkoutItemName}>{item.name} - {item.gram}g</Text>
                <View style={styles.quantityContainer}>
                    <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
                    <Text style={styles.cartItemPrice}>Base Price: ${item.price}</Text>
                </View>
            </View>
            <View style={styles.totalContainer}>
                <Text style={styles.totalPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
        </View>
    );

    const handleProceed = async () => {
        if (!address) {
            Alert.alert('Error', 'Please enter your address before proceeding.');
            return;
        }
    
        if (!userProfile) {
            Alert.alert('Error', 'User profile is not available. Please try again later.');
            return;
        }
    
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
            Alert.alert('Error', 'User token not found. Please log in again.');
            return;
        }
    
        try {
            const orderDetails = cartItems.map(item => ({
                name: item.name,
                gram: item.gram,
                quantity: item.quantity,
                itemTotal: (item.price * item.quantity).toFixed(2),
            }));
    
            const orderPayload = {
                userName: userProfile.name,
                userEmail: userProfile.email,
                address,
                mobileNumber: userProfile.mobileNumber,
                orderDetails,
                summaryTotal: totalAmount.toFixed(2),
            };

            const orderResponse = await fetch(`${config.baseURL}/orders/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify(orderPayload),
            });
    
            if (!orderResponse.ok) {
                throw new Error('Failed to place order');
            }

            const deleteResponse = await fetch(`${config.baseURL}/cart/deleteid`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({ ids: cartItems.map(item => item._id) }), // Send IDs array
            });
    
            if (!deleteResponse.ok) {
                throw new Error('Failed to clear the cart');
            }
    
            setCartItems([]);
    
            Alert.alert('Success', 'Order placed successfully!');
            navigation.navigate('Orderplaced'); 
        } catch (error) {
            console.error('Error placing order:', error);
            Alert.alert('Error', 'Error placing order');
        }
    };
    
    
    const subtotal = calculateSubtotal();
    const shippingCost = 30;
    const estimatedTax = subtotal * 0.05;
    const totalAmount = subtotal + shippingCost + estimatedTax;

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="green" />
                
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.addressInput}
                placeholder="Enter your address"
                value={address}
                onChangeText={setAddress}
            />
            <FlatList
                data={cartItems}
                renderItem={renderCheckoutItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.checkoutList}
                showsVerticalScrollIndicator={false}
            />
            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Subtotal:</Text>
                    <Text style={styles.summaryAmount}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Shipping Cost:</Text>
                    <Text style={styles.summaryAmount}>${shippingCost.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Estimated Tax (5%):</Text>
                    <Text style={styles.summaryAmount}>${estimatedTax.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
                    <Text style={styles.proceedButtonText}>Proceed</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    addressInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    checkoutList: {
        flexGrow: 1,
        paddingBottom: 16,
    },
    checkoutItem: {
        flexDirection: 'row',
        backgroundColor: '#e0f7fa', 
        borderColor: '#00796b', 
        borderWidth: 1, 
        marginBottom: 16,
        borderRadius: 8,
        padding: 8,
    },
    checkoutItemImage: {
        width: width * 0.25,
        height: 120,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    checkoutItemDetails: {
        flex: 1,
        marginLeft: 8,
    },
    checkoutItemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityContainer: {
        marginTop: 8,
    },
    cartItemQuantity: {
        fontSize: 14,
        color: '#333',
    },
    cartItemPrice: {
        fontSize: 14,
        color: '#333',
        marginTop: 4,
    },
    totalContainer: {
        justifyContent: 'center',
        borderColor:"green",
        alignItems: 'flex-end',
        borderRadius:40,
    },
    totalPrice: {
        fontSize: 18,
        color: 'green',
        fontWeight: 'bold',
    },
    summaryContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    summaryText: {
        fontSize: 16,
        color: '#333',
    },
    summaryAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color:"green",
    },
    totalRow: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 8,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
    },
    proceedButton: {
        backgroundColor: '#06a845',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    proceedButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});


export default Checkout;
