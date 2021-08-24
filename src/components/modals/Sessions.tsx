import { SessionTypes } from "@walletconnect/types";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { Image, Text, View } from "react-native";
import { Button } from "../ui/Button";

interface Props {
    sessions: SessionTypes.Settled[];
    closeSession: (topic: string) => void;
    resetCard: () => void;
}

export const Sessions: React.FC<Props> = ({
    sessions,
    closeSession,
    resetCard,
}) => {
    return (
        <View
            style={{
                flex: 1,
                padding: 20,
            }}>
            {sessions.map((session, index) => (
                <View
                    style={{
                        flex: 1,
                        padding: 5,
                    }}
                    key={session.topic}>
                    <Image source={{ uri: session.peer.metadata.icons[0] }} />
                    <Text>{session.peer.metadata.name}</Text>
                    <Text>{`Expires in ${formatDistanceToNow(
                        new Date(session.expiry)
                    )}`}</Text>
                    <Button
                        color={"red"}
                        text="Close session"
                        onPress={() => closeSession(session.topic)}></Button>
                </View>
            ))}
        </View>
    );
};
