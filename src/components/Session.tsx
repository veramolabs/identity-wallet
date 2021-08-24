import { SessionTypes } from "@walletconnect/types";
import { formatDistanceToNow } from "date-fns";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { Button } from "./ui/Button";
import { ConfirmModal } from "./ui/Modal";

interface SessionProps {
    session: SessionTypes.Settled;
    closeSession: (topic: string) => void;
}

export const Session = (props: SessionProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { session, closeSession } = props;

    console.log(session.peer.metadata.icons[0]);

    return (
        <View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFF",
                    borderRadius: 15,
                    maxHeight: 100,
                    padding: 5,
                }}>
                <Image
                    style={{ width: 40, height: 40 }}
                    source={{ uri: session.peer.metadata.icons[0] }}
                />
                <View
                    style={{
                        flexDirection: "column",
                        marginStart: 10,
                        flex: 1,
                        paddingVertical: 10,
                        justifyContent: "space-evenly",
                    }}>
                    <Text
                        style={{
                            fontWeight: "bold",
                        }}>
                        {session.peer.metadata.name}
                    </Text>
                    <Text>{`Expires in ${formatDistanceToNow(
                        new Date(session.expiry)
                    )}`}</Text>
                </View>
                <Button
                    color={"red"}
                    text="Close session"
                    onPress={() => setModalVisible(true)}
                />
            </View>
            {modalVisible ? (
                <ConfirmModal
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                    title="Bekreft"
                    description="Ønsker du å avslutte sesjonen?"
                    icon={
                        <Image
                            style={{ width: 40, height: 40 }}
                            source={{ uri: session.peer.metadata.icons[0] }}
                        />
                    }
                    onConfirmClick={() => {
                        setModalVisible(false);
                        closeSession(session.topic);
                    }}
                />
            ) : null}
        </View>
    );
};
