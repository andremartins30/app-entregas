import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home/home";
import Login from "../screens/Login/Login";
import Delivery from "../screens/Delivery/Delivery";
import Welcome from "../screens/Welcome/Welcome";
import Entregas from "../screens/Entregas/Entregas";
import ListaEntregasScreen from "../screens/Lista-Entregas/ListaEntregasScreen";
import Route from "../screens/Route/Route"
import Register from "../screens/Register/Register";
import Veiculos from "../screens/Veiculos/Veiculos";
import DeliveryComplete from "../screens/DeliveryComplete/DeliveryComplete";
import ResumoEntrega from "../screens/Entregas/ResumoEntrega";

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="Welcome"
                    component={Welcome}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                />
                <Stack.Screen
                    name="Delivery"
                    component={Delivery}
                />
                <Stack.Screen
                    name="Entregas"
                    component={Entregas}
                />
                <Stack.Screen
                    name="ListaEntregasScreen"
                    component={ListaEntregasScreen}
                />
                <Stack.Screen
                    name="Route"
                    component={Route}
                />
                <Stack.Screen
                    name="Veiculos"
                    component={Veiculos}
                />
                <Stack.Screen
                    name="DeliveryComplete"
                    component={DeliveryComplete}
                />
                <Stack.Screen
                    name="ResumoEntrega"
                    component={ResumoEntrega}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;