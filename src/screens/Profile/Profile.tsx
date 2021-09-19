import { useTheme } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "../../components/ui";
import { Colors, Sizing, Typography } from "../../styles";
import { layout } from "../../styles/sizing";
import {
    isDivider,
    Item,
    ProfileMenuRoute,
    profileNavigate,
    PROFILE_ROUTES,
} from "./profileNavigation";
import person from "../../assets/icons/person.svg";

export const Profile = () => {
    const { colors } = useTheme();
    const styles = makeStyles(colors);

    useEffect(() => {
        const doAsync = async () => {};
        doAsync();
    }, []);

    useEffect(() => {
        let subscribed = true;
        return () => {
            subscribed = false;
        };
    }, []);

    return (
        <ScrollView style={styles.container}>
            {PROFILE_ROUTES.map((item: Item, i: number) => {
                if (isDivider(item)) {
                    return <Divider key={i} color="gray" width={1} />;
                } else {
                    let routeItem = item as ProfileMenuRoute;
                    return (
                        <TouchableOpacity
                            key={i}
                            style={styles.profileRow}
                            onPress={() => profileNavigate(routeItem.routeId)}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    flex: 1,
                                    marginLeft: layout.x10,
                                }}>
                                <SvgXml xml={person} />
                            </View>
                            <View style={styles.profileRowTextColumn}>
                                <Text style={styles.title}>
                                    {routeItem.title}
                                </Text>
                                {!!routeItem.subtitle && (
                                    <Text style={styles.subtitle}>
                                        {routeItem.subtitle}
                                    </Text>
                                )}
                            </View>
                            {/* <Icon name="keyboard-arrow-right" color="gray" /> */}
                        </TouchableOpacity>
                    );
                }
            })}
        </ScrollView>
    );
};

const makeStyles = (colors: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "column",
            paddingHorizontal: 10,
            paddingVertical: 30,
        },
        profileRow: {
            flex: 1,
            flexDirection: "row",
            marginVertical: 20,
            alignItems: "center",
        },
        profileRowTextColumn: {
            flex: 4,
            flexDirection: "column",
            justifyContent: "center",
        },
        title: {
            ...Typography.subheader.x20,
            color: colors.text,
        },
        subtitle: {
            ...Typography.body.x20,
            color: Colors.neutral.white,
        },
    });
};
