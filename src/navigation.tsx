import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useContext } from "react";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { ColorContext } from "./colorContext";
import { Context } from "./context";
import { BankId } from "./screens/BankId";
import { Home } from "./screens/Home";
import { Identity } from "./screens/Identity";
import { ProfileNavigation } from "./screens/Profile/profileNavigation";
import RequestAndProposalHandler from "./screens/RequestAndProposalHandler";
import { ScannerScreen } from "./screens/ScannerScreen";
import { MainnetTheme, TestnetTheme } from "./styles";

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
    const { colors } = useTheme();
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
                    } else {
                        iconName = "person";
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
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: "gray",
                tabBarStyle: { backgroundColor: colors.card },
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
    const { selectedChain, isTest } = useContext(Context);
    const { colors, toggleDarkMode } = useContext(ColorContext);
    console.log(useContext(ColorContext));
    // const { colors } = useTheme();
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Main"
                    component={Tabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Identity"
                    component={Identity}
                    options={{
                        title: "Identitet",
                        headerTitleStyle: {
                            color: colors.onPrimary,
                        },
                    }}
                />
                <Stack.Screen
                    name="Bankid"
                    component={BankId}
                    options={{ title: "BankID" }}
                />
                <Stack.Screen
                    name="Modal"
                    component={RequestAndProposalHandler}
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
