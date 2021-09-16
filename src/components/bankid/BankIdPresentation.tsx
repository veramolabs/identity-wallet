import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BankidJWTPayload } from "../../types/bankid.types";

interface Props {
    bankIdPresentation: BankidJWTPayload;
}

export const BankIdPresentation: React.FC<Props> = ({ ...props }) => {
    return (
        <View style={styles.container}>
            <Row name="Fornavn:" value={props.bankIdPresentation.name} />
            <Row
                name="Personnummer:"
                value={props.bankIdPresentation.socialno}
            />
        </View>
    );
};

interface RowProps {
    name: string;
    value: string;
}

const Row = (props: RowProps) => {
    return (
        <View style={styles.row}>
            <Text>{props.name}</Text>
            <Text>{props.value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
});
