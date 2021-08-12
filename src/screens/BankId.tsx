import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { BankidWebview } from "../components/bankid/BankidWebview";

export const BankId = () => {
    const [bankidToken, setBankidToken] = useState<string>();
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
                <View style={styles.bankidContainer}>
                    {!bankidToken ? (
                        <BankidWebview onSuccess={setBankidToken} />
                    ) : (
                        <View>
                            <Text>Got bankidToken</Text>
                        </View>
                    )}
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
    bankidContainer: {
        padding: 10,
        flex: 1,
        backgroundColor: "blue",
    },
    actionContainer: {
        flexDirection: "row",
        alignSelf: "center",
    },
});
