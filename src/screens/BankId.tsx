import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

export const BankId = () => {
    useEffect(() => {
        console.log("Fnr", `11126138727`);
        console.log("Fnr", `14102123973`);
        console.log("Fnr", `26090286144`);
        console.log("Fnr", `09050319935`, "Jon");
        console.log("Fnr", `17107292926`, "Roberto");
        console.log("One - time password", `otp`);
        console.log("Personal password", `qwer1234`);
    }, []);

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={styles.actionContainer}>
                    <Text>BankID here</Text>
                </View>
                <WebView
                    source={{ uri: "https://vg.no" }}
                    style={{ marginTop: 20 }}
                />
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
