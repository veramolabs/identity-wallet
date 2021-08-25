import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { BankidWebview } from "../components/bankid/BankidWebview";
import { Context } from "../context";
import { BROK_HELPERS_URL, BROK_HELPERS_VERIFIER } from "@env";
import { VerifiableCredential } from "@veramo/core";
import { ethers } from "ethers";
import { decodeJWT as decodeJWT2 } from "did-jwt";
import { BankidJWTPayload } from "./../types/bankid";

const TESTING = true;

export const BankId = () => {
    const { createVC, createVP, decodeJWT } = useContext(Context);
    const [bankidToken, setBankidToken] = useState<string>(() => {
        return TESTING
            ? "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjlFMkUzN0M1MTVGRTc5MkNBQUI4NDg3REJGNkE4NTlBMEZCOEE4NEQifQ.eyJpc3MiOiJodHRwczovL2Jsb2NrY2hhbmdlcnMuY3JpaXB0by5pZCIsImF1ZCI6InVybjpteTphcHBsaWNhdGlvbjppZGVudGlmaWVyOjgwNjAiLCJpZGVudGl0eXNjaGVtZSI6Im5vYmFua2lkIiwiYXV0aGVudGljYXRpb250eXBlIjoidXJuOmdybjphdXRobjpubzpiYW5raWQ6Y2VudHJhbCIsImF1dGhlbnRpY2F0aW9ubWV0aG9kIjoidXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFjOmNsYXNzZXM6U29mdHdhcmVQS0kiLCJhdXRoZW50aWNhdGlvbmluc3RhbnQiOiIyMDIxLTA4LTI0VDEyOjU4OjM3LjE5NFoiLCJuYW1laWRlbnRpZmllciI6IjMzMWY5MTIwMDUyMDRhNWY4YmVhYmY1NDFmYjk5N2E1Iiwic3ViIjoiezMzMWY5MTIwLTA1MjAtNGE1Zi04YmVhLWJmNTQxZmI5OTdhNX0iLCJzZXNzaW9uaW5kZXgiOiIwZmQ2ODcxNy05YjQxLTRiN2MtYTFlZi00ODEzNjU1NDY0NGYiLCJ1bmlxdWVtZXJjaGFudGlkIjoiMTIzNDU2Nzg5IiwidW5pcXVldXNlcmlkIjoiOTU3OC02MDAwLTQtNTEyMzgyIiwiY2VydHN1YmplY3QiOiJDTj1cIlJhbXZpLCBKb25cIiwgTz1UZXN0QmFuazEgQVMsIEM9Tk8sIFNFUklBTE5VTUJFUj05NTc4LTYwMDAtNC01MTIzODIiLCJjZXJ0aXNzdWVyIjoiQ049QmFua0lEIC0gVGVzdEJhbmsxIC0gQmFuayBDQSAzLCBPVT0xMjM0NTY3ODksIE89VGVzdEJhbmsxIEFTLCBDPU5PIiwiaXNzdWVyIjoiQ049QmFua0lEIC0gVGVzdEJhbmsxIC0gQmFuayBDQSAzLCBPVT0xMjM0NTY3ODksIE89VGVzdEJhbmsxIEFTLCBDPU5PIiwiZGF0ZW9mYmlydGgiOiIxOTAzMDUwOSIsImJpcnRoZGF0ZSI6IjE5MDMtMDUtMDkiLCJzb2NpYWxubyI6IjA5MDUwMzE5OTM1Iiwic2VyaWFsbnVtYmVyIjoiOTU3OC02MDAwLTQtNTEyMzgyIiwiY291bnRyeSI6Ik5PIiwiaXNzdWluZ2JhbmsiOiJUZXN0QmFuazEgQVMiLCJuYW1lIjoiUmFtdmksIEpvbiIsImlhdCI6MTYyOTgwOTkxNywibmJmIjoxNjI5ODA5OTE3LCJleHAiOjE2Mjk4OTYyNTd9.wTY8LYGen_CED_kNZcCAD-4vCslwYpBoEmfA1BcnlYsPIAzf3zcE48HJ4DCP7isEBmmTwVKgIh7ona4dSW5aPiz6CLbO1SpNGE36hEMxyB4fwE9Sh6vEDJdouaSiip2S5JslCdHWSzSkhPA7TWRbBPFB45PAdrd-mnYmMirWvHwUCNAiMaqTbAhAY9cDnFWsQ0H781aNOBnIOBbp_e2pDiXCv_QhrQTKYDsX56ZIteJyXOx086GdahObUgELZZuKAyd6z5AK9MXvcKVLRQhYzbqQ7vCARsM_Luv4dMkNQKcCD85_NlzkyT1IUoqoSZFCxCxNo8gIgZ2CQQdF3JasnQ"
            : "";
    });
    const [bankidTokenDecoded, setBankidTokenDecoded] = useState(() => {
        if (bankidToken) {
            return decodeJWT2(bankidToken).payload as BankidJWTPayload;
        }
    });
    const [authVC, setAuthVC] = useState<string[]>([]);
    const [email, setEmail] = useState("");
    const [streetAddress, setstreetAddress] = useState("");
    const [postcode, setPostcode] = useState("");

    // Use bankidToken to get authVC
    useEffect(() => {
        let subscribed = true;
        const doAsync = async () => {
            if (!bankidToken) {
                return;
            }
            console.log("bankidToken => , ", decodeJWT2(bankidToken));
            const vc = await createVC({
                bankIdToken: bankidToken,
            });
            console.log("VC => ", decodeJWT2(vc.proof.jwt).payload);

            const vp = await createVP(BROK_HELPERS_VERIFIER, [vc]);
            console.log("VP => ", decodeJWT2(vp.proof.jwt).payload);

            const res = await axios.post<string[]>(
                `${
                    true ? "http://localhost:3004" : BROK_HELPERS_URL
                }/brreg/verify/bankid`,
                {
                    jwt: vp.proof.jwt,
                    skipBlockchain: true,
                    skipBankidVerify: false,
                }
            );

            const decoded = await decodeJWT(res.data[0]);
            console.log(subscribed, decoded);
            if (subscribed) {
                setAuthVC(res.data);
            }
        };
        doAsync();
        return () => {
            subscribed = false;
        };
    }, [bankidToken, createVC, createVP, decodeJWT]);

    // Use authVC to register
    const handleConfirmUserInput = async () => {
        if (!email || !streetAddress || !postcode) {
            throw Error("TODO : HANDLE THIS");
        }
        const vc = await createVC({
            epostadresse: email,
            veiaddresse: streetAddress,
            postnummer: postcode,
        });
        setAuthVC((old) => [...old, vc.proof.jwt]);

        const vp = await createVP(BROK_HELPERS_VERIFIER, authVC);
        console.log("vp 2 => ", vp.proof.jwt);

        const res = await axios.post<string[]>(
            `${
                true ? "http://localhost:3004" : BROK_HELPERS_URL
            }/brreg/entity/register`,
            {
                jwt: vp.proof.jwt,
                skipBlockchain: true,
                skipBankidVerify: false,
            }
        );
        console.log(res.data);
    };
    return (
        <>
            <StatusBar />
            <SafeAreaView style={styles.container}>
                <View style={styles.bankidContainer}>
                    {/* Step view */}
                    <View>
                        {!!bankidToken && <Text>Verifisert bankid</Text>}
                        {authVC.length > 0 && <Text>Verifisert bankid VC</Text>}
                    </View>

                    {/* Show bankidWebview */}
                    {!bankidToken ?? (
                        <BankidWebview
                            onSuccess={setBankidToken}
                            onError={(error) => console.log(error)}
                        />
                    )}
                    {/* Show register email and addresss */}
                    {authVC.length > 0 && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ textAlign: "center" }}>
                                Registrer følgende informasjon med Brreg for å
                                administrere dine aksjer
                            </Text>
                            <TextInput
                                style={styles.input}
                                value={bankidTokenDecoded?.name}
                                editable={false}
                            />
                            <TextInput
                                style={styles.input}
                                value={bankidTokenDecoded?.dateofbirth}
                                editable={false}
                            />
                            <TextInput
                                style={styles.input}
                                value={bankidTokenDecoded?.socialno}
                                editable={false}
                            />
                            <TextInput
                                placeholder={"Epost..."}
                                style={styles.input}
                                onChangeText={setEmail}
                                value={email}
                            />
                            <TextInput
                                placeholder={"Veiadresse"}
                                style={styles.input}
                                onChangeText={setstreetAddress}
                                value={streetAddress}
                            />
                            <TextInput
                                placeholder={"Postkode"}
                                style={styles.input}
                                onChangeText={setPostcode}
                                value={postcode}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity
                                onPress={() => handleConfirmUserInput()}
                                style={styles.button}>
                                <Text style={{}}>Registrer</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        alignSelf: "center",
        backgroundColor: "lightblue",
        padding: 20,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    container: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
    },
    bankidContainer: {
        padding: 10,
        flex: 1,
    },
    actionContainer: {
        flexDirection: "row",
        alignSelf: "center",
    },
});
