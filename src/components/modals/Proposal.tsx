import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SessionTypes } from "@walletconnect/types";

import { Button } from "./../ui/Button";
import { Blockchain } from "./../ui/Blockchain";
import { Metadata } from "./../ui/Metadata";

interface ProposalProps {
    proposal: SessionTypes.Proposal;
    onApprove: (
        event: SessionTypes.RequestEvent | SessionTypes.Proposal
    ) => Promise<void>;
    onReject: (
        event: SessionTypes.RequestEvent | SessionTypes.Proposal
    ) => Promise<void>;
}

export const Proposal = (props: ProposalProps) => {
    const { proposal, onApprove, onReject } = props;
    const { blockchain, jsonrpc } = proposal.permissions;
    const { metadata } = proposal.proposer;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{`Session Proposal`}</Text>
            <Metadata metadata={metadata} />
            <View style={styles.permissions}>
                <Text style={styles.permissionsTitle}>{`Chains`}</Text>
                <View>
                    {blockchain.chains.map((chainId) => (
                        <Blockchain
                            key={`proposal:blockchain:${chainId}`}
                            chainId={chainId}
                        />
                    ))}
                </View>
                <Text style={styles.permissionsTitle}>{`Methods`}</Text>
                <View>
                    {jsonrpc.methods.map((method) => (
                        <Text
                            key={`proposal:jsonrpc:${method}`}
                            style={styles.permissionsText}>
                            {method}
                        </Text>
                    ))}
                </View>
            </View>
            <View style={styles.actions}>
                <Button
                    text="Reject"
                    color="red"
                    onPress={() => onReject(proposal)}
                />
                <Button
                    text="Approve"
                    color="green"
                    onPress={() => onApprove(proposal)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        marginTop: 100,
        margin: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        marginBottom: 30,
    },
    permissions: {
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    permissionsTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
    permissionsText: { fontSize: 16, marginBottom: 10 },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
});
