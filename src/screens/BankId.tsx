import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

export const BankId = () => {
    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={styles.actionContainer}>
                    <Text>BankID here</Text>
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
        flexDirection: "row",
        alignSelf: "center",
    },
});
