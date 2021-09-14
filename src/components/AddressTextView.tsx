import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { copy, shortenAddress } from "../utils/textUtil";

interface Props {
    address: string;
}

export const AddressTextView: React.FC<Props> = ({ ...props }) => {
    const [text, setText] = useState(() => shortenAddress(props.address));

    return (
        <>
            <Text onPress={() => copy(props.address)}>{text}</Text>
        </>
    );
};
