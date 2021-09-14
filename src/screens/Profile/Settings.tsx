import { useTheme } from "@react-navigation/native";
import { UniqueVerifiableCredential } from "@veramo/data-store";
import { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { Sessions } from "../../components/modals/Sessions";
import { VCCard } from "../../components/VCCard";
import { Context } from "../../context";

export const Settings = () => {
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    const { client, closeSession, findVC } = useContext(Context);
    const [sessions, setSessions] = useState<SessionTypes.Settled[]>([]);
    const [userVcs, setUserVcs] = useState<UniqueVerifiableCredential[]>([]);
    const activeSessions = client?.session.values.length;

    useEffect(() => {
        const doAsync = async () => {
            const vc = await findVC({
                where: [],
            }).catch((err) => {
                console.error(err.message);
                throw err;
            });
            console.log("settings vc", vc);
            setUserVcs(vc);
        };
        doAsync();
    }, []);

    useEffect(() => {
        let subscribed = true;
        if (!client) {
            return;
        }
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
                <ScrollView>
                    <View style={styles.sessions}>
                        <Text h2>Sesjoner</Text>
                        {sessions.length > 0 ? (
                            <Sessions
                                sessions={sessions}
                                resetCard={() => {}}
                                closeSession={closeSession}
                            />
                        ) : (
                            <View>
                                <Text>Ingen sesjoner</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.verifiableCredentials}>
                        <Text h2>Verifiable credentials</Text>
                        {userVcs.length > 0 ? (
                            <>
                                {userVcs.map((v, i) => {
                                    return <VCCard key={i} vc={v} />;
                                    // </View>
                                })}
                            </>
                        ) : (
                            <View>
                                <Text>Ingen VC'er</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const makeStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            margin: 20,
            flex: 1,
            padding: 10,
            justifyContent: "center",
        },
        sessions: {
            flex: 1,
            marginBottom: 20,
        },
        verifiableCredentials: {
            flex: 1,
            marginBottom: 20,
        },
    });
