import React from "react";
import { View } from "react-native";

interface Props {
    color: string;
    width: number;
}

export const Divider: React.FC<Props> = ({ ...props }) => {
    return (
        <View
            style={{
                borderBottomColor: "gray",
                borderBottomWidth: 1,
            }}
        />
    );
};
