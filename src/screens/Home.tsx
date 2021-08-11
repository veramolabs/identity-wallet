import React from "react";
import {
    Button,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";

export const Home = () => {
    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={styles.actionContainer}>
                    <Button
                        title="Scan QR"
                        onPress={() => console.log("Go to WC scan")}
                    />
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
