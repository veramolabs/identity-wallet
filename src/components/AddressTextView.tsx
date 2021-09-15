import React, { useEffect, useState } from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { copy, shortenAddress } from "../utils/textUtil";

interface Props {
    style?: StyleProp<ViewStyle> | undefined;
    address: string;
}

export const AddressTextView: React.FC<Props> = ({ ...props }) => {
    const [text, setText] = useState(() => shortenAddress(props.address));

    return (
        <>
            <Text style={[props.style]} onPress={() => copy(props.address)}>
                {text}
            </Text>
        </>
    );
};
