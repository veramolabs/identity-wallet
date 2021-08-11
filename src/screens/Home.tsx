import React, { useContext } from "react";
import {
    ActivityIndicator,
    Button,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";
import { Context } from "../context";
import { navigate } from "./../navigation";

export const Home = () => {
    const { loading } = useContext(Context);
    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <View style={styles.actionContainer}>
                        <Button
                            title="Scan QR"
                            onPress={() => navigate("Scanner")}
                        />
                    </View>
                )}
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
