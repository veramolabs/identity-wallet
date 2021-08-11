import React from "react";
import {
    Button,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

export const Identity = () => {
    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={styles.actionContainer}>
                    <Text>Min Id</Text>
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
