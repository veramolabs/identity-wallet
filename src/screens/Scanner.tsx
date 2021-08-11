import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

export const Scanner = () => {
    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={styles.actionContainer}>
                    <Text>Scanner here</Text>
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
