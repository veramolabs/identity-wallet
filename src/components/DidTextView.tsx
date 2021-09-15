import React, { useState } from "react";
import { StyleProp, Text, ViewStyle } from "react-native";
import { copy, shortenDid } from "../utils/textUtil";

interface Props {
    style?: StyleProp<ViewStyle> | undefined;
    did: string;
}

export const DidTextView: React.FC<Props> = ({ ...props }) => {
    const [text, setText] = useState(() => shortenDid(props.did));
    return (
        <>
            <Text style={[props.style]} onPress={() => copy(props.did)}>
                {text}
            </Text>
        </>
    );
};
