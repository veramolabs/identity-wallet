import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useContext } from "react";
import { Icon, IconType } from "./assets/icons/Icon";
import { ColorContext } from "./colorContext";
import { Context } from "./context";
import { BankId } from "./screens/BankId";
import { Home } from "./screens/Home";
import { Identity } from "./screens/Identity";
import { ProfileNavigation } from "./screens/Profile/profileNavigation";
import RequestAndProposalHandler from "./screens/RequestAndProposalHandler";
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
    icon: IconType;
}

const HOME_ROUTE: Route = {
    routeId: "Home",
    title: "Hjem",
    icon: "home",
};

const PROFILE_ROUTE: Route = {
    routeId: "Profile",
    title: "Profil",
    icon: "account",
};

function Tabs() {
    const { colors } = useContext(ColorContext);
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: IconType;
                    if (route.name === HOME_ROUTE.routeId) {
                        iconName = HOME_ROUTE.icon;
                    } else if (route.name === PROFILE_ROUTE.routeId) {
                        iconName = PROFILE_ROUTE.icon;
                    } else {
                        iconName = "person";
                    }
                    return <Icon type={iconName} color={color} size={30} />;
                },
                tabBarActiveTintColor: colors.primary.main,
                tabBarInactiveTintColor: "gray",
                tabBarStyle: { backgroundColor: colors.surface },
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
