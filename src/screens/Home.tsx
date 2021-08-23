import React, { useContext } from "react";
import {
    ActivityIndicator,
    Button,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Sessions } from "../components/modals/Sessions";
import { Context } from "../context";
import { navigate } from "./../navigation";

export const Home = () => {
    const { loading, client } = useContext(Context);
    const sessions = client?.session.values;
    const activeSessions = client?.session.values.length;
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
                {sessions ? (
                    <Sessions
                        sessions={sessions}
                        resetCard={() => {}}
                        closeSession={() => {}}
                    />
                ) : (
                    <View>
                        <Text>""</Text>
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
