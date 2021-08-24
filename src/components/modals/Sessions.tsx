import { SessionTypes } from "@walletconnect/types";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { Image, Text, View } from "react-native";
import { Session } from "../Session";
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
                flexDirection: "column",
                flex: 1,
                padding: 20,
            }}>
            {sessions.map((session, index) => (
                <Session
                    key={session.topic}
                    session={session}
                    closeSession={closeSession}
                />
            ))}
        </View>
    );
};
