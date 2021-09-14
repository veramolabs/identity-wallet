import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useContext } from "react";
import { Settings } from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { DEFAULT_TEST_CHAINS } from "./constants/default";
import { MainnetTheme, TestnetTheme } from "./constants/theme";
import { Context } from "./context";
import { BankId } from "./screens/BankId";
import { Home } from "./screens/Home";
import { Identity } from "./screens/Identity";
import Modal from "./screens/Modal";
import { ProfileNavigation } from "./screens/Profile/profileNavigation";
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

interface Route {
    routeId: string;
    title: string;
    iconName: string;
    iconNameFocused: string;
}

const HOME_ROUTE: Route = {
    routeId: "Home",
    title: "Hjem",
    iconName: "home",
    iconNameFocused: "home",
};

const PROFILE_ROUTE: Route = {
    routeId: "Profile",
    title: "Profil",
    iconName: "account-circle",
    iconNameFocused: "account-circle",
};

function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = "";
                    if (route.name === HOME_ROUTE.routeId) {
                        iconName = focused
                            ? HOME_ROUTE.iconNameFocused
                            : HOME_ROUTE.iconName;
                    } else if (route.name === PROFILE_ROUTE.routeId) {
                        iconName = focused
                            ? PROFILE_ROUTE.iconNameFocused
                            : PROFILE_ROUTE.iconName;
                    }
                    return (
                        <Icon
                            name={iconName}
                            color={color}
                            type="material"
                            size={30}
                        />
                    );
                },
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "gray",
            })}>
            <Tab.Screen
                name={HOME_ROUTE.routeId}
                component={Home}
                options={{
                    title: HOME_ROUTE.title,
                    headerShown: false,
                }}
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
                name={PROFILE_ROUTE.routeId}
                component={ProfileNavigation}
                options={{ title: PROFILE_ROUTE.title, headerShown: false }}
            />
            {/* <Tab.Screen
                name="Settings"
                component={Settings}
                options={{ title: "Settings" }}
            /> */}
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
