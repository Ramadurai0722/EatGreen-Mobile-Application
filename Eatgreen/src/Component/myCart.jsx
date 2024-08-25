import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/baseurl';

const { width } = Dimensions.get('window');

const MyCart = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [deleteButtonTintColor, setDeleteButtonTintColor] = useState('green'); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true); 
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
                const userEmail = userProfile.email;
                setUserEmail(userEmail);

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

        fetchCartItems();
    }, []);

    const handleContinueShopping = () => {
        navigation.goBack();
    };

    const handleCheckout = () => {
        navigation.navigate('checkout');
    };

    const handleIncreaseQuantity = async (item) => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (!userToken) {
                Alert.alert('Error', 'User token not found. Please log in again.');
                return;
            }

            const updatedQuantity = item.quantity + 1;
            const updateResponse = await fetch(`${config.baseURL}/cart/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    id: item.id,
                    email: userEmail,
                    quantity: updatedQuantity,
                }),
            });

            if (updateResponse.ok) {
                setCartItems(prevItems =>
                    prevItems.map(cartItem =>
                        cartItem.id === item.id ? { ...cartItem, quantity: updatedQuantity } : cartItem
                    )
                );
            } else {
                Alert.alert('Failed', 'Failed to update quantity');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            Alert.alert('Error', 'Error updating quantity');
        }
    };

    const handleDecreaseQuantity = async (item) => {
        if (item.quantity > 1) {
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                if (!userToken) {
                    Alert.alert('Error', 'User token not found. Please log in again.');
                    return;
                }

                const updatedQuantity = item.quantity - 1;
                const updateResponse = await fetch(`${config.baseURL}/cart/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                    },
                    body: JSON.stringify({
                        id: item.id,
                        email: userEmail,
                        quantity: updatedQuantity,
                    }),
                });

                if (updateResponse.ok) {
                    setCartItems(prevItems =>
                        prevItems.map(cartItem =>
                            cartItem.id === item.id ? { ...cartItem, quantity: updatedQuantity } : cartItem
                        )
                    );
                } else {
                    Alert.alert('Failed', 'Failed to update quantity');
                }
            } catch (error) {
                console.error('Error updating quantity:', error);
                Alert.alert('Error', 'Error updating quantity');
            }
        }
    };

    const toggleSelectionMode = () => {
        setIsSelecting(!isSelecting);
        setSelectedItems([]);
        setDeleteButtonTintColor(isSelecting ? 'green' : 'red');
    };

    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleDeleteSelectedItems = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (!userToken) {
                Alert.alert('Error', 'User token not found. Please log in again.');
                return;
            }

            const deleteResponse = await fetch(`${config.baseURL}/cart/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    ids: selectedItems,
                    email: userEmail, 
                }),
            });

            if (deleteResponse.ok) {
                setCartItems(prevItems => prevItems.filter(item => !selectedItems.includes(item.id)));
                setSelectedItems([]);
                setIsSelecting(false);
                setDeleteButtonTintColor('green'); 
            } else {
                Alert.alert('Failed', 'Failed to delete selected items');
            }
        } catch (error) {
            console.error('Error deleting selected items:', error);
            Alert.alert('Error', 'Error deleting selected items');
        }
    };

    const renderCartItem = ({ item, index }) => {
        const backgroundColor = index % 4 === 0 ? '#f0f8ff' : 
            index % 4 === 1 ? '#ffffff' : 
            index % 4 === 2 ? '#d3ffd3' : 
            '#ffffff';

        return (
            <TouchableOpacity
                onPress={() => isSelecting && toggleSelectItem(item.id)}
                style={[
                    styles.cartItem,
                    isSelecting && selectedItems.includes(item.id) && styles.selectedCartItem,
                    { backgroundColor } 
                ]}
            >
                <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                <View style={styles.cartItemDetails}>
                    <View style={styles.itemNameContainer}>
                        <Text style={styles.cartItemName}>{item.name}</Text>
                        <Text style={styles.cartItemGram}>({item.gram})</Text>
                    </View>
                    <Text style={styles.cartItemPrice}>${item.price}</Text>
                    <View style={styles.quantityContainer}>
                        <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
                        <Text style={styles.totalPrice}>Total: ${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity onPress={() => handleDecreaseQuantity(item)} style={styles.quantityButton}>
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => handleIncreaseQuantity(item)} style={styles.quantityButton}>
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="green" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {cartItems.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.continueButton} onPress={handleContinueShopping}>
                            <Text style={styles.continueButtonText}>Continue Shopping</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutButtonText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.cartContainer}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={isSelecting ? handleDeleteSelectedItems : toggleSelectionMode}
                    >
                        <Image
                            source={require('../assets/delete.webp')}
                            style={[styles.deleteImage, { tintColor: deleteButtonTintColor }]}
                        />
                    </TouchableOpacity>
                    
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.cartList}
                        showsVerticalScrollIndicator={false}
                    />
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.continueButton} onPress={handleContinueShopping}>
                            <Text style={styles.continueButtonText}>Continue Shopping</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutButtonText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8', 
    },
    cartContainer: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative',
        top: 40,
        backgroundColor: '#ffffff', 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0', 
        padding: 10,
    },
    cartList: {
        flexGrow: 1,
        marginBottom: 80,
    },
    cartItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#dcdcdc', 
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 10.23,
        shadowRadius: 3.62,
        elevation: 10,
    },
    selectedCartItem: {
        borderColor: 'red',
        borderWidth: 2,
    },
    cartItemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
        top: 15,
    },
    cartItemDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    itemNameContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartItemGram: {
        fontSize: 14,
        color: 'gray',
    },
    cartItemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    totalPrice: {
        fontSize: 13,
        color: 'green',
        fontWeight: 'bold',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    quantityButton: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#ddd',
        borderRadius: 4,
        marginHorizontal: 4,
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: 20,
    },
    continueButton: {
        flex: 1,
        backgroundColor: 'white',
        borderColor: 'green',
        borderWidth: 2,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    continueButtonText: {
        color: 'green',
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkoutButton: {
        flex: 1,
        backgroundColor: '#06a845',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    deleteImage: {
        width: 30,
        height: 30,
        bottom: 50,
    },
});


export default MyCart;