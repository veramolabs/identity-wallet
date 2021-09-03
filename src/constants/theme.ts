import { DefaultTheme } from "@react-navigation/native";

export const TestnetTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#66bb6a",
        secondary: "#ffc400",
        card: "#FFF",
        onPrimary: "#FFF",
        onSecondary: ""
    },
};

export const MainnetTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: "#ec407a",
        card: "#FFF"
    },
};
