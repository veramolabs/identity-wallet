import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { WalletInfo } from "../components/ui/WalletInfo";

export const Identity = () => {
    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={styles.actionContainer}>
                    <WalletInfo />
                </View>
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
        flex: 1,
        flexDirection: "row",
        alignSelf: "center",
    },
});
