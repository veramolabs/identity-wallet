import React, { useContext, useState } from "react";
import {
    ScrollView,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    View,
    ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ColorContext, ColorSystem } from "../colorContext";
import { Buttons } from "../styles";
import { SymfoniButton } from "./ui/button";

interface Props {}

interface EditColorType {
    propName: string;
    nestedPropName?: string | undefined;
    colorValue: string;
}

export const SymfoniColorPicker: React.FC<Props> = ({ ...props }) => {
    const {
        isDarkMode,
        colors,
        toggleDarkMode,
        updatePalette,
        setDefaultColors,
    } = useContext(ColorContext);
    const [editedColors, setEditedColors] = useState<ColorSystem>(colors);
    const [editColor, setEditColor] = useState<EditColorType | undefined>(
        undefined
    );
    const [newColor, setNewColor] = useState<string | undefined>();
    const showColorPicker = !!editColor;
    const styles = makeStyles(colors);

    const saveNewColors = () => {
        let newColors: ColorSystem;

        if (!editColor) {
            return;
        }

        if (editColor.nestedPropName != undefined) {
            newColors = {
                ...editedColors,
                [editColor.propName]: {
                    // @ts-ignore
                    ...editedColors[editColor.propName],
                    [editColor.nestedPropName]: newColor,
                },
            };
            console.log(newColors);
        } else {
            newColors = {
                ...editedColors,
                [editColor.propName]: newColor,
            };
        }
        updatePalette(newColors);
        setEditedColors(newColors);
        setEditColor(undefined);
    };

    const toggleModes = () => {
        console.log("backgroun", colors.background);
        toggleDarkMode();
    };

    const onColorPress = (
        propName: string,
        colorValue: string,
        nestedPropNamme?: string
    ) => {
        const edit: EditColorType = {
            propName: propName,
            nestedPropName: nestedPropNamme,
            colorValue: colorValue,
        };
        console.log("edit");
        console.log(edit);
        setEditColor(edit);
    };

    const txt = `Change to ${isDarkMode ? "light mode" : "dark mode"}`;

    if (showColorPicker) {
        return (
            <View style={styles.container}>
                <View style={styles.buttons}>
                    <Text>Change color for</Text>
                    <Text>
                        {editColor.nestedPropName
                            ? `${editColor.propName}.${editColor.nestedPropName}`
                            : editColor.propName}
                    </Text>
                    <SymfoniButton
                        onPress={() => saveNewColors()}
                        text="Save"
                        type="success"
                    />
                </View>
                <TextInput
                    style={{
                        backgroundColor: newColor
                            ? newColor
                            : editColor.colorValue,
                    }}
                    value={newColor ? newColor : editColor.colorValue}
                    onChangeText={setNewColor}
                />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.buttons}>
                    <SymfoniButton
                        style={{ marginBottom: 10 }}
                        type={"primary"}
                        text={txt}
                        onPress={() => toggleModes()}
                    />
                    <SymfoniButton
                        type={"success"}
                        style={{ marginBottom: 10 }}
                        text={"Restore default colors"}
                        onPress={() => setDefaultColors()}
                    />
                    <SymfoniButton
                        style={{ marginBottom: 10 }}
                        type={"success"}
                        text={"Save color palette"}
                        onPress={() => saveNewColors()}
                    />
                </View>
                <ScrollView style={styles.colorButtonsContainer}>
                    <Text
                        style={{
                            ...Buttons.bar.primary,
                            color: colors.onBackground,
                        }}>
                        Colors
                    </Text>
                    <View style={styles.colors}>
                        {Object.entries(colors).map(([name, value], index) => {
                            if (typeof value == "object") {
                                return Object.entries(value).map(
                                    ([_name, _value]) => {
                                        return (
                                            <Color
                                                key={`${index}-${_value}`}
                                                onPress={() =>
                                                    onColorPress(
                                                        name,
                                                        _value as string,
                                                        _name
                                                    )
                                                }
                                                propName={`${name} ${_name}`}
                                                color={_value as string}
                                            />
                                        );
                                    }
                                );
                            } else {
                                return (
                                    <Color
                                        key={`${index}-${value}`}
                                        onPress={() =>
                                            onColorPress(name, value)
                                        }
                                        propName={name}
                                        color={value as string}
                                    />
                                );
                            }
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    }
};

interface ColorProps {
    onPress: () => void;
    propName: string;
    color: string;
    style?: StyleProp<ViewStyle> | undefined;
}

const Color: React.FC<ColorProps> = ({ ...props }) => {
    return (
        <TouchableOpacity
            onPress={() => props.onPress()}
            style={[
                props.style,
                {
                    margin: 5,
                    height: 40,
                    width: 120,
                    backgroundColor: props.color,
                    justifyContent: "center",
                    alignItems: "center",
                },
            ]}>
            <Text>{`${props.propName} ${props.color}`}</Text>
        </TouchableOpacity>
    );
};

const makeStyles = (colors: ColorSystem) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "column",
            backgroundColor: colors.background,
            padding: 20,
        },
        colorPicker: {
            flex: 0.7,
            alignItems: "center",
        },
        row: {
            flex: 0.4,
            flexDirection: "row",
        },
        colorButtonsContainer: {
            flex: 1,
        },
        buttons: {
            flexDirection: "column",
            justifyContent: "center",
            marginVertical: 20,
        },
        colors: {
            flexDirection: "column",
            alignContent: "center",
            flexWrap: "wrap",
            maxHeight: 300,
        },
    });
};
