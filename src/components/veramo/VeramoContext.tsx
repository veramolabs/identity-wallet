import {
    IDataStore,
    IDIDManager,
    IKeyManager,
    IResolver,
    TAgent,
} from "@veramo/core";
import { ICredentialIssuer } from "@veramo/credential-w3c";
import { IDataStoreORM } from "@veramo/data-store";
import React, { createContext, useEffect, useState } from "react";
import { agent as _agent } from "./VeramoUtils";

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
    // createIdentity: () => any;
}

const INITIAL_CONTEXT: IVeramoProvider = {
    // agent: undefined,
};

export const VeramoContext = createContext<IVeramoProvider | any>(
    INITIAL_CONTEXT
);

export const VeramoProvider = ({ ...props }) => {
    const [loading, setLoading] = useState(true);

    const [currentDID, setCurrentDID] = useState<string>();
    const [agent] = useState<Agent>(_agent);

    useEffect(() => {
        // agent
        //     .didManagerCreate({ kms: "local" })
        //     .then((res) => console.log(res))
        //     .catch((err) => console.error(err));
    }, []);

    // const importKey = async () => {
    //     return await this.agent.didManagerImport({
    //         services: [],
    //         provider: this.defaultDIDProvider,
    //         did: keyData.did,
    //         controllerKeyId: keyData.kid,
    //         keys: [
    //           {
    //             kid: keyData.kid,
    //             kms: 'local',
    //             type: <TKeyType>keyData.keyType,
    //             publicKeyHex: keyData.publicKeyHex,
    //             privateKeyHex: keyData.privateKeyHex,
    //           },
    //         ],
    //       });
    // }

    const createIdentity = async () => {
        const identity = await agent.didManagerCreate({
            kms: "local",
        });
        return identity;
    };

    const context = {
        agent,
        createIdentity,
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
