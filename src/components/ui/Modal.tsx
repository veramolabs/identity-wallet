import React, { useState } from "react";
import {
    TouchableOpacity,
    Alert,
    Modal,
    StyleSheet,
    Text,
    Pressable,
    View,
} from "react-native";

interface ModalProps {
    onRequestClose: () => void;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    onConfirmClick: () => void;
}

export const ConfirmModal = (props: ModalProps) => {
    return (
        <View style={styles.centeredView}>
            <Modal animationType="none" transparent={true}>
                <TouchableOpacity
                    style={styles.centeredView}
                    onPressOut={() => props.onRequestClose()}>
                    <View style={styles.modalView}>
                        {props.icon}
                        <Text style={styles.modalText}>{props.title}</Text>
                        {props.description && <Text>{props.description}</Text>}
                        <View
                            style={{
                                flexDirection: "row-reverse",
                            }}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={props.onConfirmClick}>
                                <Text style={styles.textStyle}>Ok</Text>
                            </Pressable>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
});
