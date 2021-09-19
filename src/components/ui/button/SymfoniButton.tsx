import React, { useContext } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ColorContext, ColorSystem } from "../../../colorContext";
import { Buttons, Colors } from "../../../styles";

interface Props {
    style?: StyleProp<ViewStyle> | undefined;
    iconName?: string;
    text?: string;
    type: "primary" | "secondary" | "success" | "danger";
    onPress?: () => void;
    onLongPress?: () => void;
}

export const SymfoniButton: React.FC<Props> = ({ ...props }) => {
    const { colors } = useContext(ColorContext);
    const styles = makeStyles(colors);
    let buttonStyle;
    switch (props.type) {
        case "primary":
            buttonStyle = styles.primary;
            break;
        case "secondary":
            buttonStyle = styles.secondary;
            break;
        case "success":
            buttonStyle = styles.success;
            break;
        case "danger":
            buttonStyle = styles.danger;
            break;
    }
    return (
        <TouchableOpacity
            onPress={props.onPress}
            style={[props.style, buttonStyle]}>
            <View style={styles.content}>
                {props.iconName && (
                    // <Icon
                    //     style={styles.iconStyle}
                    //     name={props.iconName}
                    //     color={Colors.neutral.white}
                    // />
                    <></>
                )}
                {props.text && (
                    <Text style={styles.buttonText}>{props.text}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const makeStyles = (colors: ColorSystem) => {
    return StyleSheet.create({
        primary: {
            backgroundColor: colors.primary.main,
            ...Buttons.bar.primary,
        },
        secondary: {
            backgroundColor: colors.secondary.main,
            ...Buttons.bar.secondary,
        },
        success: {
            ...Buttons.bar.primary,
            backgroundColor: Colors.success.s400,
        },
        danger: {
            ...Buttons.bar.primary,
            backgroundColor: Colors.danger.s400,
        },
        content: {
            flexDirection: "row",
        },
        buttonText: {
            ...Buttons.barText.primary,
        },
        iconStyle: {
            marginEnd: 5,
        },
    });
};
