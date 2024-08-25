import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/baseurl';

const MyOrdersScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                if (!userToken) {
                    Alert.alert('Error', 'User token not found. Please log in again.');
                    navigation.navigate('login');
                    return;
                }

                const response = await fetch(`${config.baseURL}/orders`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const ordersData = await response.json();
                if (ordersData.length === 0) {
                    Alert.alert('Info', 'No orders found.');
                } else {
                    setOrders(ordersData);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                Alert.alert('Error', 'Error fetching orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (!userToken) {
                Alert.alert('Error', 'User token not found. Please log in again.');
                return;
            }

            const response = await fetch(`${config.baseURL}/orders/remove/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }

            setOrders(orders.filter(order => order._id !== orderId));
            Alert.alert('Success', 'Order canceled successfully');
        } catch (error) {
            console.error('Error canceling order:', error);
            Alert.alert('Error', 'Error canceling order');
        }
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Text style={styles.orderText}>Order ID: {item._id}</Text>
            <Text style={styles.orderText}>Email: {item.userEmail}</Text>
            {item.orderDetails.map((detail, index) => (
                <View key={index} style={styles.cartItem}>
                    <Text style={styles.detailText}>{detail.name}</Text>
                    <Text style={styles.quantityText}>{`Quantity: ${detail.quantity}`}</Text>
                    <Text style={styles.detailTextAmount}>{`$${detail.itemTotal}`}</Text>
                </View>
            ))}
            <Text style={styles.totalText}>Total: ${item.summaryTotal}</Text>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelOrder(item._id)}
            >
                <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="green" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={item => item._id.toString()}
                contentContainerStyle={styles.orderList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    orderList: {
        flexGrow: 1,
        paddingBottom: 16,
    },
    orderItem: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2,
    },
    orderText: {
        fontSize: 16,
        marginBottom: 8,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    detailText: {
        fontSize: 14,
        color: '#333',
        flex: 2,
    },
    quantityText: {
        fontSize: 13,
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    detailTextAmount: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'right',
        flex: 2,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',
        marginVertical: 8,
    },
    cancelButton: {
        backgroundColor: '#d9534f',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default MyOrdersScreen;
