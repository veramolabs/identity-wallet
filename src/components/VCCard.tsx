import { useTheme } from "@react-navigation/native";
import { UniqueVerifiableCredential } from "@veramo/data-store";
import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";

interface Props {
    vc: UniqueVerifiableCredential;
}

export const VCCard: React.FC<Props> = ({ ...props }) => {
    const { vc } = props;
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    const [expanded, setExpanded] = useState<Boolean>(false);
    console.log("exp", expanded);

    return (
        <View style={expanded ? styles.cardExpanded : styles.cardCollapsed}>
            <View style={styles.basicInfo}>
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
                    <View style={styles.vcTypesIcons}>
                        {vc.verifiableCredential.type.map((vcType) => {
                            if (vcType === "PersonCredential") {
                                return (
                                    <Icon
                                        name="face"
                                        type="material"
                                        size={30}
                                    />
                                );
                            } else if (vcType === "VerifiableCredential") {
                                return (
                                    <Icon
                                        name="verified-user"
                                        type="material"
                                        size={30}
                                    />
                                );
                            }
                        })}
                    </View>
                    <View>
                        <Icon
                            name={!expanded ? "expand-more" : "expand-less"}
                            size={50}
                            onPress={() => {
                                setExpanded(!expanded);
                                console.log(expanded);
                            }}
                        />
                    </View>
                </View>
            </View>
            {expanded ? (
                <View style={styles.extraInfo}>
                    <Text>TEST EXTRA</Text>
                    <Text>
                        {JSON.stringify(vc.verifiableCredential.proof.jwt)}
                    </Text>
                </View>
            ) : null}
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
        vcTypesIcons: {
            padding: 5,
            flex: 1,
            flexDirection: "row",
        },
        vcText: {
            fontSize: 16,
            color: colors.text,
        },
        basicInfo: {
            flexDirection: "row",
            minHeight: 60,
            flex: 1,
            justifyContent: "space-between",
            marginVertical: 1,
        },
        extraInfo: {
            flexDirection: "row",
            minHeight: 40,
        },
        cardCollapsed: {
            backgroundColor: colors.primary,
            flex: 1,
            minHeight: 60,
            marginVertical: 10,
            justifyContent: "space-between",
            borderRadius: 5,
        },
        cardExpanded: {
            backgroundColor: colors.primary,
            flex: 1,
            minHeight: 100,
            marginVertical: 10,
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
