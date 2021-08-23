import { BigNumber, BigNumberish, ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Context } from "./../../context";

export const WalletInfo = () => {
    const { accounts, provider } = useContext(Context);
    const [balance, setBalance] = useState<BigNumber>(ethers.constants.Zero);

    useEffect(() => {
        const doAsync = async () => {
            if (!provider) {
                return;
            }

            try {
                const address = accounts[0].split(":").pop();
                if (!address) {
                    throw Error(`Could not parse ${accounts[0]}`);
                }
                const isAddress = ethers.utils.computeAddress(address);
                console.log("is Address => ", isAddress);

                const balance = await provider.getBalance(address);
                setBalance(balance);
            } catch (error) {
                console.error(error.message);
            }
        };
        doAsync();
    }, [accounts, provider]);

    if (!accounts) {
        return <ActivityIndicator />;
    }
    return (
        <View style={styles.grid}>
            <Text>Addresse</Text>
            <Text>{accounts[0].split(":").pop()}</Text>

            <Text>Balanse</Text>
            <Text>{ethers.utils.formatEther(balance)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flex: 1,
        flexDirection: "column",
        margin: 10,
    },
});
