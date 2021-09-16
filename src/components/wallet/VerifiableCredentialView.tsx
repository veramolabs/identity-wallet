import { VerifiableCredential } from "@veramo/core";
import { decodeJWT as decodeJWT2 } from "did-jwt";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PropertyView } from "./PropertyView";

interface Props {
    vc: VerifiableCredential;
}

export const VerifiableCredentialView: React.FC<Props> = ({ ...props }) => {
    const entries = Object.entries(props.vc.credentialSubject).map(
        ([property, payload]) => {
            return {
                property,
                payload,
            };
        }
    );

    return (
        <>
            <Text style={styles.header}>Signert av Deg:</Text>
            {entries.length > 0 &&
                entries.map((entry) => (
                    <PropertyView
                        key={entry.property}
                        property={entry.property}
                        payload={entry.payload}
                    />
                ))}
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        paddingVertical: 10,
        marginBottom: 5,
    },
});
