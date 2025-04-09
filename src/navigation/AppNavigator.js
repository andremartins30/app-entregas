import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home/home";
import Login from "../screens/Login/Login";
import Delivery from "../screens/Delivery/Delivery";


const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false,
            }}>

                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Delivery" component={Delivery} />
            </Stack.Navigator>
        </NavigationContainer>
    )
};


export default AppNavigator;