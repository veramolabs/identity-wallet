import React from "react";
import { AsyncStorage, Platform, View } from "react-native";
import { Button } from "../../components/ui/Button";
import { WalletInfo } from "../../components/ui/WalletInfo";

interface Props {}

export const Developer: React.FC<Props> = ({ ...props }) => {
    return <WalletInfo />;
};
