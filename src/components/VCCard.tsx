import { useTheme } from "@react-navigation/native";
import { UniqueVerifiableCredential } from "@veramo/data-store";
import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
    vc: UniqueVerifiableCredential;
}

export const VCCard: React.FC<Props> = ({ ...props }) => {
    const { vc } = props;
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    const [expanded, setExpanded] = useState<Boolean>(false);

    return (
        <View style={styles.vcCard}>
            <View style={styles.vcCardLeftColumn}>
                <View style={styles.row}>
                    <Text>Issuer</Text>
                    <Text
                        style={{
                            marginStart: 10,
                        }}>
                        {vc.verifiableCredential.issuer.id.substring(0, 20)}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text>Type</Text>
                    <Text style={{}}>
                        {vc.verifiableCredential.type.join(`${"\n"}`)}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text>Issued</Text>
                    <Text>
                        {format(
                            parseISO(vc.verifiableCredential.issuanceDate),
                            "HH.mm dd.MM.yyyy"
                        )}
                    </Text>
                </View>
            </View>
            <View style={styles.vcCardRightColumn}>
                {/* <Icon
                    name="face"
                    type="material"
                    size={30}
                    onPress={() => setExpanded(!expanded)}
                /> */}
            </View>
        </View>
    );
};

const makeStyles = (colors: any) =>
    StyleSheet.create({
        row: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        vcText: {
            fontSize: 16,
            color: colors.text,
        },
        vcCard: {
            backgroundColor: colors.primary,
            flex: 1,
            flexDirection: "row",
            marginVertical: 10,
            minHeight: 60,
            justifyContent: "space-between",
            borderRadius: 5,
        },
        vcCardLeftColumn: {
            paddingHorizontal: 10,
            flex: 2,
            flexDirection: "column",
            justifyContent: "space-evenly",
        },
        vcCardRightColumn: {
            paddingHorizontal: 10,
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-evenly",
        },
    });
