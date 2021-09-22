import { useTheme } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "../../assets/icons/Icon";
import { ColorContext, ColorSystem } from "../../colorContext";
import { Divider } from "../../components/ui";
import { Colors, Sizing, Typography } from "../../styles";
import { layout } from "../../styles/sizing";
import {
    isDivider,
    Item,
    ProfileMenuRoute,
    profileNavigate,
    PROFILE_ROUTES,
} from "./ProfileNavigation";

export const Profile = () => {
    const { colors } = useContext(ColorContext);
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
                    return (
                        <Divider
                            key={i}
                            color={Colors.neutral.s300}
                            width={1}
                        />
                    );
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
                                <Icon
                                    type={routeItem.icon}
                                    color={colors.primary.light}
                                    size={Sizing.icons.x30}
                                />
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
                            <Icon
                                type="next-arrow"
                                color={Colors.neutral.s500}
                                size={Sizing.icons.x30}
                            />
                        </TouchableOpacity>
                    );
                }
            })}
        </ScrollView>
    );
};

const makeStyles = (colors: ColorSystem) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            flexDirection: "column",
            paddingHorizontal: layout.x10,
            paddingVertical: layout.x30,
        },
        profileRow: {
            flex: 1,
            flexDirection: "row",
            marginVertical: layout.x20,
            alignItems: "center",
        },
        profileRowTextColumn: {
            flex: 4,
            flexDirection: "column",
            justifyContent: "center",
        },
        title: {
            ...Typography.subheader.x20,
            color: colors.onBackground,
        },
        subtitle: {
            ...Typography.body.x20,
            color: Colors.neutral.s400,
        },
    });
};
