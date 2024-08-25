import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Userlogin from '../Auth/login';
import Userregister from '../Auth/register';
import Profile from '../Component/profile';
import Home from '../Component/Home';
import MyCart from '../Component/myCart';
import Checkout from '../Component/chekout';
import OrderPlacedSuccess from '../Component/orderplaced';
import CategoryTrend from '../Component/categorytrend';
import CategoryVeg from '../Component/categoryveg';
import CategoryMasala from '../Component/categorymasala';
import CategorySpinach from '../Component/categoryspinach';
import MyFavourite from '../Component/myFavourites';
import MyOrdersScreen from '../Component/myorder';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen
          name="login"
          component={Userlogin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="register"
          component={Userregister}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            title: 'Profile',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="myCart"
          component={MyCart}
          options={{
            title: 'My Cart',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="checkout"
          component={Checkout}
          options={{
            title: 'Checkout',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="trend"
          component={CategoryTrend}
          options={{
            title: 'Trending Deals',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="vegetable"
          component={CategoryVeg}
          options={{
            title: 'Vegetables',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="masala"
          component={CategoryMasala}
          options={{
            title: 'Masalas',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="spinach"
          component={CategorySpinach}
          options={{
            title: 'Spinach',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="fav"
          component={MyFavourite}
          options={{
            title: 'My Favourites',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="myorder"
          component={MyOrdersScreen}
          options={{
            title: 'My Orders',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Orderplaced"
          component={OrderPlacedSuccess}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
