import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Text } from "react-native";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { BankidWebview } from "../components/bankid/BankidWebview";
import { Context } from "../context";
import { BROK_HELPERS_URL, BROK_HELPERS_VERIFIER } from "@env";
import { VerifiableCredential } from "@veramo/core";

export const BankId = () => {
    const { createVC, createVP, decodeJWT } = useContext(Context);
    const [bankidToken, setBankidToken] = useState<string>(() => {
        return "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjlFMkUzN0M1MTVGRTc5MkNBQUI4NDg3REJGNkE4NTlBMEZCOEE4NEQifQ.eyJpc3MiOiJodHRwczovL2Jsb2NrY2hhbmdlcnMuY3JpaXB0by5pZCIsImF1ZCI6InVybjpteTphcHBsaWNhdGlvbjppZGVudGlmaWVyOjgwNjAiLCJpZGVudGl0eXNjaGVtZSI6Im5vYmFua2lkIiwiYXV0aGVudGljYXRpb250eXBlIjoidXJuOmdybjphdXRobjpubzpiYW5raWQ6Y2VudHJhbCIsImF1dGhlbnRpY2F0aW9ubWV0aG9kIjoidXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFjOmNsYXNzZXM6U29mdHdhcmVQS0kiLCJhdXRoZW50aWNhdGlvbmluc3RhbnQiOiIyMDIxLTA4LTI0VDEyOjU4OjM3LjE5NFoiLCJuYW1laWRlbnRpZmllciI6IjMzMWY5MTIwMDUyMDRhNWY4YmVhYmY1NDFmYjk5N2E1Iiwic3ViIjoiezMzMWY5MTIwLTA1MjAtNGE1Zi04YmVhLWJmNTQxZmI5OTdhNX0iLCJzZXNzaW9uaW5kZXgiOiIwZmQ2ODcxNy05YjQxLTRiN2MtYTFlZi00ODEzNjU1NDY0NGYiLCJ1bmlxdWVtZXJjaGFudGlkIjoiMTIzNDU2Nzg5IiwidW5pcXVldXNlcmlkIjoiOTU3OC02MDAwLTQtNTEyMzgyIiwiY2VydHN1YmplY3QiOiJDTj1cIlJhbXZpLCBKb25cIiwgTz1UZXN0QmFuazEgQVMsIEM9Tk8sIFNFUklBTE5VTUJFUj05NTc4LTYwMDAtNC01MTIzODIiLCJjZXJ0aXNzdWVyIjoiQ049QmFua0lEIC0gVGVzdEJhbmsxIC0gQmFuayBDQSAzLCBPVT0xMjM0NTY3ODksIE89VGVzdEJhbmsxIEFTLCBDPU5PIiwiaXNzdWVyIjoiQ049QmFua0lEIC0gVGVzdEJhbmsxIC0gQmFuayBDQSAzLCBPVT0xMjM0NTY3ODksIE89VGVzdEJhbmsxIEFTLCBDPU5PIiwiZGF0ZW9mYmlydGgiOiIxOTAzMDUwOSIsImJpcnRoZGF0ZSI6IjE5MDMtMDUtMDkiLCJzb2NpYWxubyI6IjA5MDUwMzE5OTM1Iiwic2VyaWFsbnVtYmVyIjoiOTU3OC02MDAwLTQtNTEyMzgyIiwiY291bnRyeSI6Ik5PIiwiaXNzdWluZ2JhbmsiOiJUZXN0QmFuazEgQVMiLCJuYW1lIjoiUmFtdmksIEpvbiIsImlhdCI6MTYyOTgwOTkxNywibmJmIjoxNjI5ODA5OTE3LCJleHAiOjE2Mjk4OTYyNTd9.wTY8LYGen_CED_kNZcCAD-4vCslwYpBoEmfA1BcnlYsPIAzf3zcE48HJ4DCP7isEBmmTwVKgIh7ona4dSW5aPiz6CLbO1SpNGE36hEMxyB4fwE9Sh6vEDJdouaSiip2S5JslCdHWSzSkhPA7TWRbBPFB45PAdrd-mnYmMirWvHwUCNAiMaqTbAhAY9cDnFWsQ0H781aNOBnIOBbp_e2pDiXCv_QhrQTKYDsX56ZIteJyXOx086GdahObUgELZZuKAyd6z5AK9MXvcKVLRQhYzbqQ7vCARsM_Luv4dMkNQKcCD85_NlzkyT1IUoqoSZFCxCxNo8gIgZ2CQQdF3JasnQ";
    });

    useEffect(() => {
        console.log("Fnr", `11126138727`);
        console.log("Fnr", `14102123973`);
        console.log("Fnr", `26090286144`);
        console.log("Fnr", `09050319935`, "Jon");
        console.log("Fnr", `17107292926`, "Roberto");
        console.log("One - time password", `otp`);
        console.log("Personal password", `qwer1234`);
    }, []);

    useEffect(() => {
        if (!bankidToken) {
            return;
        }
        const doAsync = async () => {};
        doAsync();
    }, [bankidToken, createVC]);

    useEffect(() => {
        let subscribed = true;
        const doAsync = async () => {
            if (!bankidToken) {
                return;
            }
            console.log("bankidToken => , ", bankidToken);
            const vc = await createVC({
                bankIdToken: bankidToken,
            });
            // console.log("VC => ", vc);

            const vp = await createVP(BROK_HELPERS_VERIFIER, [vc]);

            const res = await axios.post<string[]>(
                `${BROK_HELPERS_URL}/brreg/verify/bankid`,
                {
                    jwt: vp.proof.jwt,
                    skipBlockchain: true,
                    skipBankidVerify: false,
                }
            );
            console.log("res => ", res.data[0]);
            const decoded = await decodeJWT(res.data[0]);
            console.log("decoded", decoded);
            if (subscribed) {
            }
        };
        doAsync();
        return () => {
            subscribed = false;
        };
    }, [bankidToken, createVC, createVP, decodeJWT]);

    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={styles.bankidContainer}>
                    {!bankidToken ? (
                        <BankidWebview
                            onSuccess={setBankidToken}
                            onError={(error) => console.log(error)}
                        />
                    ) : (
                        <View>
                            <Text>Got bankidToken</Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
    },
    bankidContainer: {
        padding: 10,
        flex: 1,
        backgroundColor: "blue",
    },
    actionContainer: {
        flexDirection: "row",
        alignSelf: "center",
    },
});
