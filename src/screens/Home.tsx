import { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import React, { useContext, useEffect, useState } from "react";
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
    const { loading, client, closeSession } = useContext(Context);
    const [sessions, setSessions] = useState<SessionTypes.Settled[]>([]);
    const activeSessions = client?.session.values.length;

    useEffect(() => {
        let subscribed = true;
        if (!client) {
            return;
        }
        setSessions(client.session.values);
        console.log("Setting sessions");
        client.on(CLIENT_EVENTS.session.deleted, (some: any) => {
            console.log("deleted", some);
            if (subscribed) {
                setSessions(client.session.values);
            }
        });
        client.on(CLIENT_EVENTS.session.created, (some: any) => {
            console.log("created", some);
            if (subscribed) {
                setSessions(client.session.values);
            }
        });
        return () => {
            subscribed = false;
        };
    }, [client, client?.session]);

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
