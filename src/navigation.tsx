import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useContext } from "react";
import { DEFAULT_TEST_CHAINS } from "./constants/default";
import { MainnetTheme, TestnetTheme } from "./constants/theme";
import { Context } from "./context";
import { BankId } from "./screens/BankId";
import { Home } from "./screens/Home";
import { Identity } from "./screens/Identity";
import { Settings } from "./screens/Settings";
import Modal from "./screens/Modal";
import { ScannerScreen } from "./screens/ScannerScreen";

export const navigationRef = React.createRef<any>();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export function navigate(name: string, params?: any) {
    if (typeof navigationRef.current === "undefined") {
        return;
    }
    navigationRef.current.navigate(name, params);
}

export function goBack() {
    if (typeof navigationRef.current === "undefined") {
        return;
    }
    navigationRef.current.goBack();
}

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
            <Tab.Screen
                name="Bankid"
                component={BankId}
                options={{ title: "BankID" }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{ title: "Settings" }}
            />
        </Tab.Navigator>
    );
}

export const Navigation = () => {
    const { selectedChain } = useContext(Context);
    return (
        <NavigationContainer
            theme={
                DEFAULT_TEST_CHAINS.includes(selectedChain)
                    ? TestnetTheme
                    : MainnetTheme
            }
            ref={navigationRef}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Main"
                    component={Tabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Modal"
                    component={Modal}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Scanner"
                    component={ScannerScreen}
                    options={{ title: "Scan QR" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
