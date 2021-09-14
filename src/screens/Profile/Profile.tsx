import { useTheme } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { color } from "react-native-elements/dist/helpers";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Divider } from "../../components/Divider";
import {
    isDivider,
    Item,
    ProfileMenuRoute,
    profileNavigate,
    PROFILE_ROUTES,
} from "./profileNavigation";

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
                console.log("item", item);
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
                                    marginLeft: 10,
                                }}>
                                <Icon
                                    name={routeItem.iconName}
                                    size={30}
                                    color="tomato"
                                />
                            </View>
                            <View style={styles.profileRowTextColumn}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {routeItem.title}
                                </Text>
                                {!!routeItem.subtitle && (
                                    <Text style={{ color: "gray" }}>
                                        {routeItem.subtitle}
                                    </Text>
                                )}
                            </View>
                            <Icon name="keyboard-arrow-right" color="gray" />
                        </TouchableOpacity>
                    );
                }
            })}
        </ScrollView>
    );
};

const makeStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "column",
            padding: 20,
        },
        profileRow: {
            flex: 1,
            flexDirection: "row",
            marginVertical: 30,
            alignItems: "center",
        },
        profileRowTextColumn: {
            flex: 4,
            flexDirection: "column",
            justifyContent: "center",
        },
    });
