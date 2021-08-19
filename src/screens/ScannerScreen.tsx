import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Scanner } from "../components/scanner/Scanner";

export const ScannerScreen = () => {
    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <Scanner />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
    },
    actionContainer: {
        flexDirection: "row",
        alignSelf: "center",
    },
});
