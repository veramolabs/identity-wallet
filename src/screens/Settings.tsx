import { useTheme } from "@react-navigation/native";
import { UniqueVerifiableCredential } from "@veramo/data-store";
import { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { format, parseISO } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Sessions } from "../components/modals/Sessions";
import { VCCard } from "../components/VCCard";
import { Context } from "../context";
import { fontStyles } from "../styles/font";

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
                <View>
                    <Text style={fontStyles.h1}>Sesjoner</Text>
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
                <Text style={fontStyles.h1}>Verifiable credentials</Text>
                {userVcs.length > 0 ? (
                    <>
                        {userVcs.map((v) => (
                            <VCCard vc={v} />
                            // </View>
                        ))}
                    </>
                ) : (
                    <View>
                        <Text>Ingen VC'er</Text>
                    </View>
                )}
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
    });
