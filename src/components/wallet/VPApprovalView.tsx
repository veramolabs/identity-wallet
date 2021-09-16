import { VerifiablePresentation } from "@veramo/core";
import { normalizePresentation } from "did-jwt-vc";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SymfoniButton } from "../ui/button/SymfoniButton";
import { VerifiableCredentialView } from "./VerifiableCredentialView";

interface Props {
    vp: string | VerifiablePresentation;
    onApprove: () => void;
    onReject: () => void;
}

// type VP = BankidJWTPayload;

export const VPApprovalView: React.FC<Props> = ({ ...props }) => {
    const testVp =
        "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2cCI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwidmVyaWZpYWJsZUNyZWRlbnRpYWwiOlsiZXlKaGJHY2lPaUpGVXpJMU5rc2lMQ0owZVhBaU9pSktWMVFpZlEuZXlKMll5STZleUpBWTI5dWRHVjRkQ0k2V3lKb2RIUndjem92TDNkM2R5NTNNeTV2Y21jdk1qQXhPQzlqY21Wa1pXNTBhV0ZzY3k5Mk1TSmRMQ0owZVhCbElqcGJJbFpsY21sbWFXRmliR1ZEY21Wa1pXNTBhV0ZzSWl3aVVHVnljMjl1UTNKbFpHVnVkR2xoYkNKZExDSmpjbVZrWlc1MGFXRnNVM1ZpYW1WamRDSTZleUpsY0c5emRHRmtjbVZ6YzJVaU9pSjBaWE4wUUdWdFlXbHNMbU52YlNJc0luWmxhV0ZrWkhKbGMzTmxJam9pVkdWemRIWmxhV1Z1SURFeU15SXNJbkJ2YzNSdWRXMXRaWElpT2lJd05UVTJJaXdpYVdSbGJuUnBkSGxRY205dlppSTZJbVY1U2pCbFdFRnBUMmxLUzFZeFVXbE1RMHBvWWtkamFVOXBTbE5WZWtreFRtbEpjMGx0ZEhCYVEwazJTV3BzUmsxclZYcE9NRTB4VFZSV1IxSlVZelZOYTA1Q1VWVkpORTVFWnpOU1JVcEhUbXRGTkU1VWJFSk5SVnBEVDBWRk5FNUZVV2xtVVM1bGVVcHdZek5OYVU5cFNtOWtTRkozWTNwdmRrd3lTbk5pTWs1eVdUSm9hR0p0Wkd4amJrMTFXVE5LY0dGWVFqQmllVFZ3V2tOSmMwbHRSakZhUTBrMlNXNVdlV0pxY0hSbFZIQm9ZMGhDYzJGWFRtaGtSMngyWW1wd2NGcEhWblZrUjJ4dFlWZFdlVTlxWjNkT2FrRnBURU5LY0ZwSFZuVmtSMnd3WlZoT2FtRkhWblJhVTBrMlNXMDFkbGx0Um5WaE1teHJTV2wzYVZsWVZqQmhSMVoxWkVkc2FsbFlVbkJpTWpVd1pWaENiRWxxYjJsa1dFcDFUMjFrZVdKcWNHaGtXRkp2WW1wd2RXSjZjR2xaVnpWeVlWZFJObGt5Vm5Wa1NFcG9Za05KYzBsdFJqRmtSMmhzWW01U2NGa3lSakJoVnpsMVlsZFdNR0ZIT1d0SmFtOXBaRmhLZFU5dE9XaGpNbXg2VDIwMWFHSlhWbnBQYmxKcVQyeE9RbFJWZHpaTmFUUjNUMjFHYWs5dFRuTlpXRTU2V2xoTk5sVXlPVzFrU0dSb1kyMVdVVk13YTJsTVEwcG9aRmhTYjFwWE5UQmhWMDVvWkVkc2RtSnRiSFZqTTFKb1ltNVJhVTlwU1hsTlJFbDRURlJCTkV4VVNUSldSRUUwVDJwRk1FOXFSVFZNYWxGM1RteHZhVXhEU25WWlZ6RnNZVmRTYkdKdVVuQmFiV3hzWTJsSk5rbHFXWGhOYlVwcVQwUkpOVTVFUm10T1JGSnFXWHBhYUUxNlpHdE5iVWsxV1ZSamVVNVVRWGhPZWtsM1NXbDNhV016Vm1sSmFtOXBaWHBaZUUxdFNtcFBSRWsxVEZSUmVGcEVVWFJPUjA1cVRta3hhRTE2Wkd0TVZFcHBUMWRGTTAxcVZYZE5WR041VFVnd2FVeERTbnBhV0U1NllWYzVkV0ZYTld0YVdHZHBUMmxLYVU1cVVtcE9iVlV5V1ZNd01rOUhUVFZNVkZKclRsZEZkRmx0UlRWWlV6Rm9UbXBSZDFwcVNUVlpWR013VDFkWmFVeERTakZpYld4NFpGZFdkRnBZU21waFIwWjFaRWRzYTBscWIybE5WRWw2VGtSVk1rNTZaelZKYVhkcFpGYzFjR05ZVm14a1dFNXNZMjFzYTBscWIybFBWRlV6VDBNd01rMUVRWGRNVkZGMFRrUlpNRTU2VlhoSmFYZHBXVEpXZVdSSVRqRlpiWEJzV1ROUmFVOXBTa1JVYWpGalNXdDRka3hEUWs1aU0wb3dXbGMxWTBscGQyZFVlakZWV2xoT01GRnRSblZoZWtWblVWWk5jMGxGVFRsVWF6aHpTVVpPUmxWcmJFSlVSVFZXVkZWS1JsVnFNRFZPVkdNMFRGUlpkMDFFUVhST1F6QXdUbXBSTTA1VVJXbE1RMHBxV2xoS01HRllUbnBrVjFaNVNXcHZhVkV3TkRsUmJVWjFZVEJzUlVsRE1HZFdSMVo2WkVWS2FHSnRjM2hKUXpCblVXMUdkV0Y1UWtSUlUwRjZURU5DVUZaVU1IaE5hazB3VGxSWk0wOUVhM05KUlRnNVZrZFdlbVJGU21oaWJYTjRTVVZHVkV4RFFrUlFWVFZRU1dsM2FXRllUbnBrVjFaNVNXcHZhVkV3TkRsUmJVWjFZVEJzUlVsRE1HZFdSMVo2WkVWS2FHSnRjM2hKUXpCblVXMUdkV0Y1UWtSUlUwRjZURU5DVUZaVU1IaE5hazB3VGxSWk0wOUVhM05KUlRnNVZrZFdlbVJGU21oaWJYTjRTVVZHVkV4RFFrUlFWVFZRU1dsM2FWcEhSakJhVnpsdFdXMXNlV1JIWjJsUGFVbDRUMVJKZUUxVVFYaE9RMGx6U1cxS2NHTnVVbTlhUjBZd1dsTkpOa2xxUlRWTmFrVjBUVlJCZEUxVVVXbE1RMHA2WWpKT2NGbFhlSFZpZVVrMlNXcEZNRTFVUVhsTlZFbDZUMVJqZWtscGQybGpNbFo1WVZkR2MySnVWblJaYlZaNVNXcHZhVTlVVlROUFF6QXlUVVJCZDB4VVVYUk9SRmt3VG5wVmVFbHBkMmxaTWpreFltNVNlV1ZUU1RaSmF6VlFTV2wzYVdGWVRucGtWMngxV2pKS2FHSnRjMmxQYVVwVldsaE9NRkZ0Um5WaGVrVm5VVlpOYVV4RFNuVlpWekZzU1dwdmFWUkhPSE5KUlRGMlkyNVNiR0pwU1hOSmJXeG9aRU5KTmsxVVdYbFBWR3N5VGxSWk1VOVRkMmxpYlVwdFNXcHZlRTVxU1RWUFZGa3hUbXBWTlV4RFNteGxTRUZwVDJwRk1rMTZRWGRPVkVVMVQxUnNPUzU0T1ZGdkxWUjZlVGhrVGxCRVRXRlphMUkxVkVoc1MzTnFlVEJaUXpORlQyWmZNRzEyV1VjNGRYWnBTSFJrZG1GdE5qbGhVVTluTlU1aWIyZFZVVzVKV1hGSmVHeFZhR0ZEUmpSVWNuUjNjR1ZLWXpsNGFqbFdiMWt4UlVWSU0zTjJlV1IxWVdSU1FVMWlhemxLT1dndFdGcEhlRFZJTlc4dGVsRnhjVGd3UXpsQlZ6VTRVMFpNVjJZdFJucGZja0p1VFhCTWRIQXROVUZUWmsxaWRVbEphRWhPYVRsVWNUZG9VazFhZHprNE9WbDVRbHBJTTJoU2NsTnJiMXBwVW5KWWExQm9kbGsyYkcxaVVqQkVPRVpSY2tkMGNUWTFSbkpPWlVkUVQwUmZTREYzZGt4ZlptdHlXRkpFUzBOVVVVRllaa2RuTjFoek1HeE1VVGxCWm1aak5VazVVVk51WWxOS2F6aElWMVl3WkVWNlUyTXdibGhGU0ZCcU1EQm1RVXRuVDNWbVdrdHFOblJKVFRka01UTk1TRUpqVkUxM1dVYzVXRmhYZFZoSVFWUm5NMnhyWDNacVduQmhYMmN4YWtOd01WZFNXRUVpZlgwc0luTjFZaUk2SW1ScFpEcGxkR2h5T2pReU1UWXhNVG93ZURBeU5XSTBNREZrTURReVlXUTJPV0UwWmpOa05qQTBOV0UzTlRnM01UTmpNR1l4WldReU56ZG1aVGsyWW1Vek56VmhaRFEwTnpRNU9UVmhPREprTVdZM05pSXNJbTVpWmlJNk1UWXlPVGszTURBNE1pd2lhWE56SWpvaVpHbGtPbVYwYUhJNk5ESXhOakV4T2pCNE1ESTFZalF3TVdRd05ESmhaRFk1WVRSbU0yUTJNRFExWVRjMU9EY3hNMk13WmpGbFpESTNOMlpsT1RaaVpUTTNOV0ZrTkRRM05EazVOV0U0TW1ReFpqYzJJbjAuV1dvWEloVnVQZjF6bVNtblNmak1ZWURqaTJZc0Y3aWlmblRTUkhmbFNQZWJZaWZnQ2JUcFdheGVjY1UtU29WcG5RZkZHYnUwaU1YNGE1ZTl1a0lIOEEiXX0sIm5iZiI6MTYyOTk3MDA4MiwiaXNzIjoiZGlkOmV0aHI6NDIxNjExOjB4MDI1YjQwMWQwNDJhZDY5YTRmM2Q2MDQ1YTc1ODcxM2MwZjFlZDI3N2ZlOTZiZTM3NWFkNDQ3NDk5NWE4MmQxZjc2IiwiYXVkIjpbImRpZDpldGhyOjQyMTYxMToweDAyYmRlOTg0N2FkODU2OWRmMTU5YjU3ODNkZjM4OWMyZGI0ZDAwYzI1YTRjNDgyMmVlYTZmYjk5NjNiMDk2ZTE2ZCJdfQ.MUm5YU2oW5AaKVbWpsopZExJphDOiaBwSvpjp5voOYFE7vUfL5NZKayW6AgcjqJxFcZIu1PoJ-BbzBIy9rLItw";

    const [verifiablePresentation, setVerifiablePresentation] =
        useState<VerifiablePresentation>(() => {
            if (typeof props.vp === "string") {
                return normalizePresentation(props.vp);
            } else {
                return props.vp;
            }
        });

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Dele data</Text>
            <Text style={styles.description}>
                Ønsker du å dele disse opplysningene med:
            </Text>
            <View style={styles.description}>
                <Text style={styles.identifier}>
                    {verifiablePresentation.verifier
                        .map((s) => s.substring(0, 12))
                        .join(", ")}
                </Text>
            </View>
            {verifiablePresentation.verifiableCredential?.map((vc, i) => (
                <VerifiableCredentialView key={i} vc={vc} />
            ))}
            {/* <BankIdPresentation bankIdPresentation={vp} /> */}

            {/* {Object.entries(credentials).map(([key, value]) => {
                <Text>hei</Text>;
            })} */}
            <View style={styles.actions}>
                <SymfoniButton
                    text="Reject"
                    type="danger"
                    onPress={() => props.onReject()}
                />
                <SymfoniButton
                    text="Approve"
                    type="success"
                    onPress={() => props.onApprove()}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: "700",
        alignSelf: "center",
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 10,
    },
    container: {
        paddingHorizontal: 20,
        height: 100,
        flex: 1,
        backgroundColor: "#FEFEFE",
        margin: 20,
    },
    credential: {
        minHeight: 100,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    actions: {
        margin: 5,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    identifier: {
        textAlign: "center",
        padding: 10,
        alignSelf: "baseline",
        backgroundColor: "lightblue",
        color: "white",
        borderRadius: 15,
    },
});
