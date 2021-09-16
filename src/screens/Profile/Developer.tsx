import React from "react";
import { AsyncStorage, Platform, View } from "react-native";
import { WalletInfo } from "../../components/wallet";

interface Props {}

export const Developer: React.FC<Props> = ({ ...props }) => {
    return <WalletInfo />;
};
