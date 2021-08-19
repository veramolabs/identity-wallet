// Core interfaces
import {
    IDataStore,
    IDIDManager,
    IKeyManager,
    IResolver,
    TAgent,
} from "@veramo/core";
import { ICredentialIssuer } from "@veramo/credential-w3c";
// Storage plugin using TypeOrm
import { IDataStoreORM } from "@veramo/data-store";
import React, { createContext, useEffect, useState } from "react";
import { agent } from "./VeramoUtils";

export type Agent = TAgent<
    IDIDManager &
        IKeyManager &
        IDataStore &
        IDataStoreORM &
        IResolver &
        ICredentialIssuer
>;

export interface IVeramoProvider {
    // agent?: Agent;
}

const INITIAL_CONTEXT: IVeramoProvider = {
    // agent: undefined,
};

export const VeramoContext = createContext<IVeramoProvider>(INITIAL_CONTEXT);

export const VeramoProvider = ({ ...props }) => {
    const [loading, setLoading] = useState(true);

    const [currentDID, setCurrentDID] = useState<string>();

    useEffect(() => {
        agent
            .didManagerCreate({ kms: "local" })
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
    }, []);

    // const createIdentity = async () => {
    //     const identity = await agent.didManagerCreate({
    //         kms: "local",
    //     });
    //     return identity;
    // };

    // const listIdentities = async () => {
    //     const identifiers = await agent.didManagerFind();
    //     return identifiers;
    // };

    // const issueCredential = async (
    //     data: Record<string, any>,
    //     subjectDidId: string,
    //     type: string[],
    // ) => {
    //     const vc = await agent.createVerifiableCredential({
    //         proofFormat: "jwt",
    //         save: true,
    //         credential: {
    //             type: ["VerifiableCredential", ...type],
    //             credentialSubject: {
    //                 ...data,
    //                 id: subjectDidId,
    //             },
    //             issuer: {
    //                 id: currentDID,
    //             },
    //         },
    //     });
    //     return vc;
    // };

    // const verifyJWT = async (jwt: string) => {
    //     try {
    //         await agent.handleMessage({
    //             raw: jwt,
    //         });
    //         return true;
    //     } catch (error) {
    //         console.log("JWT not valid => ", error);
    //         return false;
    //     }
    // };

    // const verifyVP = async (jwt: string) => {
    //     try {
    //         await agent.handleMessage({
    //             raw: jwt,
    //         });
    //         return true;
    //     } catch (error) {
    //         console.log("VP not valid => ", error);
    //         return false;
    //     }
    // };

    // const createVerfiablePresentation = async (
    //     verifier: string,
    //     verifiableCredentials: VerifiableCredential[],
    // ) => {
    //     const vs = await agent.createVerifiablePresentation({
    //         presentation: {
    //             holder: currentDID,
    //             verifier: [verifier],
    //             verifiableCredential: verifiableCredentials,
    //         },
    //         proofFormat: "jwt",
    //     });
    //     return vs;
    // };

    // const findCredentials = async (did: string) => {
    //     const credentials = await agent.dataStoreORMGetVerifiableCredentials({
    //         where: [{ column: "subject", value: [did] }],
    //     });
    //     return credentials;
    // };

    // const decodeJWT = async (
    //     jwt: string,
    //     verifyOptions?: Partial<VerifyOptions>,
    // ) => {
    //     try {
    //         await verifyJWT(jwt);
    //         const payload = JSON.parse(
    //             // eslint-disable-next-line no-undef
    //             Buffer.from(jwt.split(".")[1], "base64").toString(),
    //         ) as JwtPayload;
    //         const errors = [];
    //         if (verifyOptions) {
    //             try {
    //                 const isVP =
    //                     "vp" in payload &&
    //                     payload.vp.type.includes("VerifiablePresentation");
    //                 if (verifyOptions.requireVerifiablePresentation && !isVP) {
    //                     throw Error(
    //                         "JWT is not a VerifiablePresentation, expected a JWT with vp property and VerifiablePresentation in vp.types ",
    //                     );
    //                 }
    //                 if (verifyOptions.decodeCredentials) {
    //                     if (!Array.isArray(payload.vp.verifiableCredential)) {
    //                         errors.push(
    //                             `JWT vp.verifiableCredential was ${typeof payload
    //                                 .vp.verifiableCredential}, expected Array`,
    //                         );
    //                     }
    //                     const decodedVerifiableCredentials = await Promise.all(
    //                         payload.vp.verifiableCredential.map(
    //                             async (subJWT: any) => {
    //                                 try {
    //                                     // Decode sub credential with overridden options,
    //                                     // REVIEW Is it correct to make sure VP issuer is subject of VC?
    //                                     const decoded = await decodeJWT(
    //                                         subJWT,
    //                                         {
    //                                             ...verifyOptions,
    //                                             decodeCredentials: false,
    //                                             audience: undefined,
    //                                             subject: payload.vp.iss,
    //                                             requireVerifiablePresentation:
    //                                                 false,
    //                                         },
    //                                     );
    //                                     return decoded;
    //                                 } catch (error) {
    //                                     errors.push(
    //                                         `Error decoding subcredential: ${
    //                                             error.message
    //                                             // eslint-disable-next-line no-undef
    //                                         }. \nSubcredential was: \n${Buffer.from(
    //                                             subJWT.split(".")[1],
    //                                             "base64",
    //                                         ).toString()}`,
    //                                     );
    //                                 }
    //                             },
    //                         ),
    //                     );
    //                     payload.vp.JWTs =
    //                         decodedVerifiableCredentials as JwtPayload[];
    //                 }
    //             } catch (error) {
    //                 errors.push(
    //                     `JWT traited as Verifiable Presentation, error while decoding subcredential: ${error.message}`,
    //                 );
    //             }

    //             if (verifyOptions.audience) {
    //                 if (typeof payload.aud === "string") {
    //                     if (payload.aud !== verifyOptions.audience) {
    //                         errors.push(
    //                             `JWT audience was ${payload.aud}, expected ${verifyOptions.audience}`,
    //                         );
    //                     }
    //                 } else if (Array.isArray(payload.aud)) {
    //                     if (!payload.aud.includes(verifyOptions.audience)) {
    //                         errors.push(
    //                             `JWT audience was ${payload.aud.join(
    //                                 " | ",
    //                             )}, expected one of ${verifyOptions.audience}`,
    //                         );
    //                     }
    //                 } else {
    //                     throw Error(
    //                         `JWT .aud expected string or Array, got ${typeof payload.aud}`,
    //                     );
    //                 }
    //             }
    //             if (verifyOptions.issuer) {
    //                 if (typeof payload.iss !== "string") {
    //                     throw Error(
    //                         `JWT issuer expected string, got ${typeof payload.iss}`,
    //                     );
    //                 }
    //                 if (typeof verifyOptions.issuer === "string") {
    //                     if (payload.iss !== verifyOptions.issuer) {
    //                         errors.push(
    //                             `JWT issuer was ${payload.iss}, expected ${verifyOptions.issuer}`,
    //                         );
    //                     }
    //                 } else if (Array.isArray(verifyOptions.issuer)) {
    //                     if (!verifyOptions.issuer.includes(payload.iss)) {
    //                         errors.push(
    //                             `JWT issuer was ${
    //                                 payload.iss
    //                             }, expected one of ${verifyOptions.issuer.join(
    //                                 " | ",
    //                             )}`,
    //                         );
    //                     }
    //                 } else {
    //                     errors.push(
    //                         `verifyOptions.issuer was ${typeof verifyOptions.issuer}, expected Array or string`,
    //                     );
    //                 }
    //             }
    //             if (verifyOptions.subject) {
    //                 if (payload.sub !== verifyOptions.subject) {
    //                     errors.push(
    //                         `JWT subject was ${payload.sub}, expected ${verifyOptions.subject}`,
    //                     );
    //                 }
    //             }
    //         }
    //         if (errors.length > 0) {
    //             throw Error(errors.join(".\n"));
    //         }
    //         return payload;
    //     } catch (error) {
    //         console.log("Cant decode JWT => ", error.message);
    //         throw error;
    //     }
    // };
    const context = {
        // agent,
    };
    return (
        <VeramoContext.Provider value={context}>
            {props.children}
        </VeramoContext.Provider>
    );
};

export interface VerifyOptions {
    audience: string;
    complete: boolean;
    issuer: string | string[];
    ignoreExpiration: boolean;
    ignoreNotBefore: boolean;
    subject: string;
    decodeCredentials: boolean;
    requireVerifiablePresentation: boolean;
}

export interface JwtPayload {
    [key: string]: any;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
}
