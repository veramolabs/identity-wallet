/* eslint-disable no-undef */
import { BROK_HELPERS_VERIFIER } from "@env";
import {
    IDataStore,
    IDIDManager,
    IIdentifier,
    IKeyManager,
    IResolver,
    TAgent,
    VerifiableCredential,
    VerifiablePresentation,
} from "@veramo/core";
import { ICredentialIssuer } from "@veramo/credential-w3c";
import {
    FindArgs,
    IDataStoreORM,
    TCredentialColumns,
    UniqueVerifiableCredential,
} from "@veramo/data-store";
import Client from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { ethers } from "ethers";
import React, { createContext, useEffect, useState } from "react";
import { DEFAULT_RPC_PROVIDER, DEFAULT_TEST_CHAINS } from "./constants/default";
import { navigate } from "./navigation";
import { useVeramo } from "./utils/useVeramo";
import { useWalletconnect } from "./utils/useWalletconnect";

export type Agent = TAgent<
    IDIDManager &
        IKeyManager &
        IDataStore &
        IDataStoreORM &
        IResolver &
        ICredentialIssuer
>;
export type Dispatch<T = any> = React.Dispatch<React.SetStateAction<T>>;

export interface IContext {
    loading: boolean;
    chains: string[];
    accounts: string[];
    client: Client | undefined;
    proposals: SessionTypes.Proposal[];
    setProposals: Dispatch<SessionTypes.Proposal[]>;
    requests: SessionTypes.RequestEvent[];
    setRequests: Dispatch<SessionTypes.RequestEvent[]>;
    closeSession: (topic: string) => Promise<void>;
    onApprove: (
        event: SessionTypes.RequestEvent | SessionTypes.Proposal
    ) => Promise<void>;
    onReject: (
        event: SessionTypes.RequestEvent | SessionTypes.Proposal
    ) => Promise<void>;
    selectedChain: string;
    provider: ethers.providers.Provider;
    identity?: IIdentifier;
    deleteVeramoData: () => void;
    createVC: (data: Record<string, any>) => Promise<VerifiableCredential>;
    createVP: (
        verifier: string,
        verifiableCredentials: VerifiableCredential[] | string[]
    ) => Promise<VerifiablePresentation>;
    decodeJWT: (
        jwt: string,
        verifyOptions?: Partial<VerifyOptions> | undefined
    ) => Promise<JwtPayload>;
    findVC: (
        args: FindArgs<TCredentialColumns>
    ) => Promise<UniqueVerifiableCredential[]>;
    saveVP: (vp: VerifiablePresentation | string) => Promise<string>;
}

export const Context = createContext<IContext>(undefined!);

export const ContextProvider = (props: any) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [chains] = useState<string[]>(DEFAULT_TEST_CHAINS);
    const [selectedChain, setSelectedChain] = useState(DEFAULT_TEST_CHAINS[0]);
    const [provider] = useState(
        () =>
            new ethers.providers.JsonRpcProvider({
                url: DEFAULT_RPC_PROVIDER,
            })
    );
    const veramo = useVeramo(selectedChain);
    const walletconnect = useWalletconnect(chains, veramo);
    const [hasTrustedIndentity, setHasTrustedIndentity] = useState<boolean>();

    // Loading
    useEffect(() => {
        if (walletconnect.client) {
            setLoading(false);
        }
    }, [walletconnect.client]);

    // Check if user got indetifier
    useEffect(() => {
        let subscribed = true;
        const doAsync = async () => {
            if (veramo.identity) {
                const vc = await veramo
                    .findVC({
                        where: [
                            {
                                column: "issuer",
                                value: [BROK_HELPERS_VERIFIER],
                            },
                            {
                                column: "subject",
                                value: [veramo.identity?.did],
                            },
                        ],
                    })
                    .catch((err) => {
                        console.error(err.message);
                        throw err;
                    });
                const hasRegistered = vc.find((vc) => {
                    // console.log(vc.verifiableCredential.credentialSubject);
                    return (
                        "brregRegistered" in
                        vc.verifiableCredential.credentialSubject
                    );
                });
                console.info("hasTrustedIndentity", !!hasRegistered);
                setHasTrustedIndentity(!!hasRegistered);
            }
            if (subscribed) {
            }
        };
        doAsync();
        return () => {
            subscribed = false;
        };
    }, [veramo, veramo.identity]);

    // navigate user if not got identifier
    useEffect(() => {
        if (hasTrustedIndentity === false) {
            // TODO - @Asbjørn - Make toast about going to bankID
            navigate("Bankid");
        }
    }, [hasTrustedIndentity]);

    // Make the context object:
    const context: IContext = {
        loading,
        chains,
        provider,
        selectedChain,
        ...walletconnect,
        ...veramo,
    };

    // pass the value in provider and return
    return (
        <Context.Provider value={context}>{props.children}</Context.Provider>
    );
};

export const { Consumer } = Context;
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
