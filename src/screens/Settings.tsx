import { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Sessions } from "../components/modals/Sessions";
import { Context } from "../context";

export const Settings = () => {
    const { client, closeSession } = useContext(Context);
    const [sessions, setSessions] = useState<SessionTypes.Settled[]>([]);
    const activeSessions = client?.session.values.length;

    useEffect(() => {
        let subscribed = true;
        if (!client) {
            return;
        }
        console.log(client.session.values);
        setSessions(client.session.values);
        client.on(CLIENT_EVENTS.pairing.deleted, (some: any) => {
            console.log("deleted", some);
            console.log("subscribed", subscribed);
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
            <SafeAreaView style={styles.container}>
                {activeSessions && activeSessions > 0 ? (
                    <Text>Tilkoblet</Text>
                ) : (
                    <Text>Ikke tilkoblet</Text>
                )}
                {sessions.length > 0 ? (
                    <Sessions
                        sessions={sessions}
                        resetCard={() => {}}
                        closeSession={closeSession}
                    />
                ) : (
                    <View>
                        <Text>Ingen sessions</Text>
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
