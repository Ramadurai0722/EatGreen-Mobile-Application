import React, { useEffect, useState, useRef } from 'react';
import { Text, TextInput, StyleSheet, Image, Dimensions, Alert, TouchableOpacity, FlatList, View, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/baseurl';
import TrendingDeals from './trendingdeal';

const { width } = Dimensions.get('window');

const Home = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [activeButton, setActiveButton] = useState('Home');
    const [currentIndex, setCurrentIndex] = useState(0);

    const carouselRef = useRef(null);
    const searchInputRef = useRef(null);
    

    const carouselItems = [
        { image: require('../assets/carousel-1.png'), route: 'masala' },
        { image: require('../assets/carousel-2.png'), route: 'vegetable' },
        { image: require('../assets/carousel-3.png'), route: 'spinach' },
    ];

    const categories = [
        { image: require('../assets/vegetables.png'), text: 'Vegetable', route: 'vegetable' },
        { image: require('../assets/spinachc.png'), text: 'Spinach', route: 'spinach' },
        { image: require('../assets/trendingc.png'), text: 'Trending', route: 'trend' },
        { image: require('../assets/masalac.png'), text: 'Masalas', route: 'masala' },
    ];

    const filteredCategories = categories.filter(category =>
        category.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % carouselItems.length;
                carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
                return nextIndex;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleSearch = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleCategoryPress = (route) => {
        navigation.navigate(route);
    };

    const handleCaroselPress = (route) => {
        navigation.navigate(route);
    };

    const handleProfilePress = () => {
        navigation.navigate("Profile");
    };

    const handleNavigation = (route) => {
        setActiveButton(route);
        if (route !== 'Search' && route !== 'Categories') {
            navigation.navigate(route);
        }
    };

    const renderCarouselItem = ({ item }) => (
        <View style={styles.carouselItem}>
            <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => handleCaroselPress(item.route)}>
                <Image source={item.image} style={styles.carouselImage} />
                <TouchableOpacity style={styles.shopNowButton} onPress={() => handleCaroselPress(item.route)}>
                    <Text style={styles.shopNowButtonText}>Shop Now</Text>
                </TouchableOpacity></TouchableOpacity>
            </View>
        </View>
    );

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(item.route)}
        >
            <Image source={item.image} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.text}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
            showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{userProfile.name}</Text>
                                <View style={styles.locationContainer}>
                                    <Image
                                        source={require('../assets/location-icon.png')}
                                        style={{ width: 20, height: 20, tintColor: 'orange' }}
                                    />
                                    <Text style={styles.userLocation}>{userProfile.location}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleProfilePress()}
                            >
                                <Image
                                    source={require('../assets/profile.png')}
                                    style={styles.profileImage}
                                /></TouchableOpacity>
                        </View>

                        <View style={styles.searchContainer}>
                            <TextInput
                                ref={searchInputRef}
                                style={styles.searchInput}
                                placeholder="Search Categories..."
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
                            ref={carouselRef}
                            data={carouselItems}
                            renderItem={renderCarouselItem}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            snapToAlignment="center"
                            decelerationRate="fast"
                            snapToInterval={width * 0.8}
                            style={styles.carouselContainer}
                        />

                        <Text style={[
                            styles.categoriesHeading,
                            activeButton === 'Categories' && styles.activeCategoriesHeading
                        ]}>
                            Explore the Categories
                        </Text>
                    </>
                }
                ListFooterComponent={
                    <>
                        <View style={styles.categoryContainer}>
                            <FlatList
                                data={filteredCategories}
                                renderItem={renderCategoryItem}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={4}
                                columnWrapperStyle={styles.categoryColumn}
                            />
                        </View>

                        <TrendingDeals />
                    </>
                }
                contentContainerStyle={styles.container}
            />

            <View style={styles.bottomNavBar}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => handleNavigation('Home')}
                >
                    <Image
                        source={require('../assets/home.png')}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: activeButton === 'Home' ? 'yellow' : 'white',
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => handleNavigation('Categories')}
                >
                    <Image
                        source={require('../assets/category.png')}
                        style={{
                            width: 20,
                            height: 20,
                            tintColor: activeButton === 'Categories' ? 'yellow' : 'white',
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleNavigation('myCart')}
                    style={{
                        borderRadius: 40,
                        backgroundColor: "white",
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        source={require('../assets/card.png')}
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: activeButton === 'Cart' ? 'green' : 'green',
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => handleNavigation('fav')}
                >
                    <Image
                        source={require('../assets/heart.png')}
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: activeButton === 'Favorites' ? 'yellow' : 'white',
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => handleNavigation('Search')}
                >
                    <Image
                        source={require('../assets/searchimage.jpg')}
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: activeButton === 'Search' ? 'yellow' : 'white',
                        }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 5,
        backgroundColor: '#f5f5f5',
        bottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    userInfo: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 40,
    },
    userName: {
        fontSize: 25,
        fontWeight: 'bold',
        left: 5,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userLocation: {
        fontSize: 15,
        color: 'green',
        marginLeft: 5,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginTop: 30,
        objectFit:"contain",
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
    carouselContainer: {
        marginTop: 0,
        marginBottom: 25,
    },
    carouselItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 10,
        width: width * 0.8,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    shopNowButton: {
        position: 'absolute',
        bottom: 10,
        left: 70,
        backgroundColor: '#06a845',
        padding: 3,
        borderRadius: 5,
    },
    shopNowButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    activeCategoriesHeading: {
        color: 'darkgreen',
    },
    categoriesHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    categoryContainer: {
        marginBottom: 15,
    },
    categoryItem: {
        flex: 1,
        margin: 10,
        alignItems: 'center',
    },
    categoryImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    categoryText: {
        marginTop: 5,
        fontSize: 16,
    },
    categoryColumn: {
        justifyContent: 'space-between',
        marginHorizontal: 5,
    },

    bottomNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: "darkgreen",
        borderRadius: 10,
    },
    navButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Home;
