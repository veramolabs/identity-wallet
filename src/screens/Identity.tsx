import { WalletInfo } from "../components/ui/WalletInfo";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Button,
} from "react-native";
import { VeramoContext } from "../components/veramo/VeramoContext";

export const Identity = () => {
    const { createIdentity, agent } = useContext(VeramoContext);
    const [ids, setIds] = useState<any[]>([]);

    const getIds = async () => {
        const ids = await agent.didManagerFind();
        setIds(ids);
    };

    const createIdentifier = async () => {
        await createIdentity();
        getIds();
    };

    useEffect(() => {
        getIds();
    });

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={styles.actionContainer}>
                    <WalletInfo />
                    <Button
                        title="Create ID"
                        onPress={() => createIdentifier()}
                    />
                </View>
                {ids.map((id) => {
                    return <Text>{id.did}</Text>;
                })}
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
        flex: 1,
        flexDirection: "row",
        alignSelf: "center",
    },
});
