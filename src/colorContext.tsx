import { Colors } from "react-native/Libraries/NewAppScreen";
import { lineHeight } from "./styles/typography";
import React, { createContext, SetStateAction, useState } from "react";
import { createConnection } from "typeorm";

export interface ColorSystem {
    primary: {
        light: string;
        main: string;
        dark: string;
    };
    secondary: {
        light: string;
        main: string;
        dark: string;
    };
    background: string;
    surface: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
}

export interface IColorContext {
    colors: ColorSystem;
    toggleDarkMode: () => void;
    updatePalette: (colorSystem: ColorSystem) => void;
}

const DEFAULT_DARKMODE_COLORS: ColorSystem = {
    primary: {
        light: "#6f74dd",
        main: "#3949ab",
        dark: "#00227b",
    },
    secondary: {
        light: "#ffaf4c",
        main: "#f47e17",
        dark: "#bb5000",
    },
    background: "#000",
    onBackground: "#FFF",
    surface: "#000",
    onPrimary: "#FFF",
    onSecondary: "#000",
};
const DEFAULT_LIGHT_COLORS: ColorSystem = {
    primary: {
        light: "#6f74dd",
        main: "#3949ab",
        dark: "#00227b",
    },
    secondary: {
        light: "#ffaf4c",
        main: "#f47e17",
        dark: "#bb5000",
    },
    background: "#FFF",
    onBackground: "#000",
    surface: "#FFF",
    onPrimary: "#FFF",
    onSecondary: "#000",
};

export const ColorContext = createContext<IColorContext>(undefined!);

export const ColorContextProvider = (props: any) => {
    const deriveCurrentColorScheme = (isDarkMode: boolean) => {
        if (isDarkMode) {
            return darkModeColors;
        } else {
            return lightColors;
        }
    };

    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [lightColors, setLightColors] =
        useState<ColorSystem>(DEFAULT_LIGHT_COLORS);
    const [darkModeColors, setDarkModeColors] = useState<ColorSystem>(
        DEFAULT_DARKMODE_COLORS
    );
    const colors: ColorSystem = deriveCurrentColorScheme(isDarkMode);

    const updatePalette = (newPalette: ColorSystem) => {
        if (isDarkMode) {
            setDarkModeColors(newPalette);
        } else {
            setLightColors(newPalette);
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const context: IColorContext = {
        colors,
        toggleDarkMode,
        updatePalette,
    };

    return (
        <ColorContext.Provider value={context}>
            {props.children}
        </ColorContext.Provider>
    );
};
