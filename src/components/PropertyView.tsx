import { decodeJWT } from "did-jwt";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BankidJWTPayload } from "../types/bankid";

interface Props {
    property: string;
    payload: string | number;
}

enum PROPERTY_TYPE {
    IDENTITY_TOKEN,
    STRING,
    NUMBER,
}

export const PropertyView: React.FC<Props> = ({ ...props }) => {
    const [propertyType, setPropertyType] = useState<PROPERTY_TYPE>();

    useEffect(() => {
        if (props.property === "identityProof") {
            setPropertyType(PROPERTY_TYPE.IDENTITY_TOKEN);
        } else if (typeof props.property === "string") {
            setPropertyType(PROPERTY_TYPE.STRING);
        } else if (typeof props.property === "number") {
            setPropertyType(PROPERTY_TYPE.NUMBER);
        } else {
            throw Error(
                `Need to check for this type!!, ${typeof props.property}`
            );
        }
    }, []);

    const IdentityTokenView = ({ ...props }) => {
        const [token, setToken] = useState<BankidJWTPayload>(() => {
            return decodeJWT(props.token).payload as BankidJWTPayload;
        });
        return (
            <>
                <Text style={styles.header}>Signert av BankID:</Text>
                <View style={styles.row}>
                    <Text>Navn:</Text>
                    <Text style={styles.text}>{token.name}</Text>
                </View>

                <View style={styles.row}>
                    <Text>Fødselsdag</Text>
                    <Text style={styles.text}>{token.dateofbirth}</Text>
                </View>
                <View style={styles.row}>
                    <Text>Personnummer</Text>
                    <Text style={styles.text}>{token.socialno}</Text>
                </View>
            </>
        );
    };

    return (
        <>
            {propertyType === PROPERTY_TYPE.IDENTITY_TOKEN ? (
                <IdentityTokenView token={props.payload} />
            ) : (
                <View style={styles.row}>
                    <Text style={styles.text}>{props.property}</Text>
                    <Text style={styles.text}>{props.payload}</Text>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    text: {
        flex: 1,
        fontSize: 16,
    },
    header: {
        fontSize: 18,
        paddingVertical: 10,
        marginBottom: 5,
    },
});
