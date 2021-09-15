import React from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import { Icon } from "react-native-elements";
import { baseProps } from "react-native-gesture-handler/lib/typescript/handlers/gestureHandlers";
import { Buttons, Colors, Sizing } from "../styles";

interface Props {
    style?: StyleProp<ViewStyle> | undefined;
    iconName?: string;
    text?: string;
    type: "primary" | "secondary" | "success" | "danger";
    onPress?: () => void;
    onLongPress?: () => void;
}

export const SymfoniButton: React.FC<Props> = ({ ...props }) => {
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
        <Pressable onPress={props.onPress} style={[props.style, buttonStyle]}>
            <View style={styles.content}>
                {props.iconName && (
                    <Icon
                        style={styles.iconStyle}
                        name={props.iconName}
                        color={Colors.neutral.white}
                    />
                )}
                {props.text && (
                    <Text style={styles.buttonText}>{props.text}</Text>
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    primary: {
        ...Buttons.bar.primary,
    },
    secondary: {
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
