// OrderPlacedSuccess.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const OrderPlacedSuccess = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Celebrate Image */}
            <Image
                source={require('../assets/celebrate.png')}
                style={styles.celebrate}
            />
            {/* Logo Image */}
            <Image
                source={require('../assets/shoppinglogo.png')}
                style={styles.logo}
            />
            <Text style={styles.thankYou}>Thank You</Text>
            {/* Right Tick Image */}
            <Image
                source={require('../assets/righttick.png')}
                style={styles.tick}
            />
            <Text style={styles.successText}>Order placed successfully!!!</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    celebrate: {
        width: '100%',
        height: 150,
        position: 'absolute',
        top: 0,
        left: 0,
        resizeMode: 'cover',
        tintColor:"green",
    },
    logo: {
        width: 200,
        height: 200,
        marginTop: 100, 
        tintColor: 'green',
    },
    tick: {
        width: 250,
        height: 250,
        marginBottom: 20,
        tintColor: 'green',
    },
    thankYou: {
        fontSize: 24,
        color: 'green',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    successText: {
        fontSize: 18,
        color: 'green',
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'green',
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default OrderPlacedSuccess;
