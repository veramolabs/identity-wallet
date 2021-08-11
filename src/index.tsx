import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Home } from "./screens/Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Identity } from "./screens/Identity";
import { navigationRef } from "./navigation";
import { Scanner } from "./screens/Scanner";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{ title: "Hjem" }}
            />
            <Tab.Screen
                name="Identity"
                component={Identity}
                options={{ title: "Identitet" }}
            />
        </Tab.Navigator>
    );
}

const App = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Tabs"
                    component={Tabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ title: "Symfoni Identity Wallet" }}
                />
                <Stack.Screen
                    name="Scanner"
                    component={Scanner}
                    options={{ title: "Scan QR" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

// const styles = StyleSheet.create({
//     sectionContainer: {
//         marginTop: 32,
//         paddingHorizontal: 24,
//     },
//     sectionTitle: {
//         fontSize: 24,
//         fontWeight: "600",
//     },
//     sectionDescription: {
//         marginTop: 8,
//         fontSize: 18,
//         fontWeight: "400",
//     },
//     highlight: {
//         fontWeight: "700",
//     },
// });

export default App;
