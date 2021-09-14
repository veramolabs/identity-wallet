import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { copy, shortenAddress, shortenDid } from "../utils/textUtil";

interface Props {
    did: string;
}

export const DidTextView: React.FC<Props> = ({ ...props }) => {
    const [text, setText] = useState(() => shortenDid(props.did));
    return (
        <>
            <Text onPress={() => copy(props.did)}>{text}</Text>
        </>
    );
};
