import React from "react";
import { View } from "react-native";
import { SymfoniModal } from "../../components/ui/Modal";
import { goBack } from "../../navigation";

interface Props {}

export const Help: React.FC<Props> = ({ ...props }) => {
    return (
        <View>
            {/* <SymfoniModal
                onRequestClose={() => {
                    // goBack();
                }}
                title="Dette er en tittel"
                description="DDette er en forklaring som er veldig lang...as, Dette er en forklaring som er veldig lang...asd dette er en forklaring som er veldig lang...asd"
                onConfirmClick={() => {}}
                onDismissClick={() => {}}
            /> */}
        </View>
    );
};
