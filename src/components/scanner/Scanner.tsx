import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { Button } from "../ui/Button";

import { Context } from "./../../context";

export const Scanner = () => {
    const { client } = useContext(Context);

    async function onRead(data: any) {
        console.log("Scanning");
        console.log(data);
        if (typeof data !== "string") {
            return;
        }
        if (!data.startsWith("wc:")) {
            return;
        }
        // try {
        //     if (typeof client === "undefined") {
        //         return;
        //     }
        //     await client.pair({ uri: data });
        // } catch (e) {
        //     console.error(e);
        //     return;
        // }
    }

    async function onTextInput(uri: string) {
        if (!uri.startsWith("wc:")) {
            return;
        }
        console.log("Received URI from input: ", uri);
        if (client) {
            await client.pair({ uri: uri });
        }
    }

    return (
        <>
            <QRCodeScanner
                onRead={(e: any) => onRead(e.data)}
                fadeIn={false}
                topContent={
                    <Text style={styles.centerText}>
                        Scan WalletConnect QRcode
                    </Text>
                }
            />
            <TextInput
                style={styles.inputText}
                placeholder="Eller skriv WC kode her"
                onChangeText={(text: string) => onTextInput(text)}
                defaultValue={""}
            />
            {/* TODO : Only for test */}
            <Button text="Reset storage" onPress={() => AsyncStorage.clear()} />
        </>
    );
};

export const styles = StyleSheet.create({
    inputText: {
        borderColor: "#ccc",
        backgroundColor: "#ccc",
        height: 40,
        margin: 10,
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        paddingTop: 100,
        color: "#000",
    },
    textBold: {
        fontWeight: "500",
        color: "#fff",
    },
    buttonText: {
        fontSize: 21,
        color: "rgb(0,122,255)",
    },
    button: {
        padding: 16,
    },
});
