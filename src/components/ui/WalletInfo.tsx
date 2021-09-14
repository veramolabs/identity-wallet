import { BigNumber, ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    AsyncStorage,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { AddressTextView } from "../AddressTextView";
import { DidTextView } from "../DidTextView";
import { Context } from "./../../context";

export const WalletInfo = () => {
    const { accounts, provider, deleteVeramoData, identity } =
        useContext(Context);
    const [balance, setBalance] = useState<BigNumber>(ethers.constants.Zero);
    const [address, setAddress] = useState(() => accounts[0].split(":").pop());

    useEffect(() => {
        const doAsync = async () => {
            if (!provider || !accounts) {
                return;
            }
            try {
                if (!address) {
                    return;
                }
                const balance = await provider.getBalance(address);
                setBalance(balance);
            } catch (error) {
                console.error("Could not fetch balance for address", address);
            }
        };
        doAsync();
    }, [accounts, address, provider]);

    const clearAsyncStorage = async () => {
        const asyncStorageKeys = await AsyncStorage.getAllKeys();
        if (asyncStorageKeys.length > 0) {
            if (Platform.OS === "android") {
                await AsyncStorage.clear();
            }
            if (Platform.OS === "ios") {
                await AsyncStorage.multiRemove(asyncStorageKeys);
            }
        }
    };

    if (!address) {
        return <ActivityIndicator />;
    }
    return (
        <View style={styles.grid}>
            <Text style={styles.title}>Your data</Text>
            <Text style={styles.subtitle}>
                Caution, be careful what you do here!
            </Text>
            <View style={styles.row}>
                <Text>Adresse</Text>
                <AddressTextView address={address} />
            </View>
            {/* <Text style={styles.infoText} onPress={() => copy(address)}>
                {shortAddress}
            </Text> */}

            <View style={styles.row}>
                <Text>Balanse</Text>
                <Text>{ethers.utils.formatEther(balance)}</Text>
            </View>
            <View style={styles.row}>
                <Text>DID</Text>
                <DidTextView did={identity ? identity.did : "Ingen DID"} />
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => deleteVeramoData()}>
                    <Text style={styles.buttonText}>Delete veramo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => clearAsyncStorage()}>
                    <Text style={styles.buttonText}>Delete Local data</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 34,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
    },
    grid: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        margin: 10,
        padding: 30,
    },
    row: {
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-around",
        margin: 10,
    },
    button: {
        alignSelf: "center",
        backgroundColor: "blue",
        padding: 10,
        marginVertical: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
    },
});
