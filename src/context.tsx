/* eslint-disable no-undef */
// import axios from "axios";
// import Wallet from "caip-wallet";
// import Client from "@walletconnect/client";
// import { SessionTypes } from "@walletconnect/types";

// import KeyValueStorage from "keyvaluestorage";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    formatJsonRpcError,
    formatJsonRpcResult,
    JsonRpcError,
    JsonRpcResponse,
} from "@json-rpc-tools/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VerifiablePresentation } from "@veramo/core";
import {
    IDataStore,
    IDIDManager,
    IIdentifier,
    IKeyManager,
    IResolver,
    TAgent,
    VerifiableCredential,
} from "@veramo/core";
import { ICredentialIssuer } from "@veramo/credential-w3c";
import {
    Credential,
    FindArgs,
    FindClaimsArgs,
    FindCredentialsArgs,
    IDataStoreORM,
    TCredentialColumns,
    TPresentationColumns,
    UniqueVerifiableCredential,
} from "@veramo/data-store";
import Client, { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { ethers, Wallet } from "ethers";
import React, { createContext, useEffect, useState } from "react";
import { useCallback } from "react";
import {
    agent,
    agent as _agent,
    deleteVeramoData,
} from "./components/veramo/VeramoUtils";
import {
    DEFAULT_APP_METADATA,
    DEFAULT_EIP155_METHODS,
    DEFAULT_RELAY_PROVIDER,
    DEFAULT_TEST_CHAINS,
} from "./constants/default";
import { goBack, navigate } from "./navigation";
import { normalizePresentation } from "did-jwt-vc";

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
    const [accounts, setAccounts] = useState<string[]>([]);
    const [client, setClient] = useState<Client | undefined>(undefined);
    const [provider] = useState(
        () =>
            new ethers.providers.JsonRpcProvider({
                url: "https://arbitrum-rinkeby.infura.io/v3/eaa35471bb7947adb685b17daa1030d4",
            })
    );
    const [proposals, setProposals] = useState<SessionTypes.Proposal[]>([]);
    const [requests, setRequests] = useState<SessionTypes.RequestEvent[]>([]);
    const [identity, setIdentity] = useState<IIdentifier>();
    const [agent] = useState<Agent>(_agent);

    // Init Veramo identity
    useEffect(() => {
        const getIdentity = async () => {
            try {
                const createIdentity = async () => {
                    const identity = await agent.didManagerCreate({
                        kms: "local",
                        provider: "did:ethr:421611",
                    });
                    return identity;
                };
                const identifiers = await agent.didManagerFind();
                if (identifiers.length === 0) {
                    return createIdentity();
                }
                return identifiers[0];
            } catch (error) {
                console.error(error);
            }
        };
        const initWallet = async () => {
            const _identity = await getIdentity();
            if (!_identity) {
                throw Error("Identity Failed");
            }

            try {
                const tx = {
                    value: ethers.utils.parseEther("0.1"),
                    to: "0x9cffE66dc8aAE6c7684AC30804154BF242021BbB",
                };
                const signed = await agent.keyManagerSignEthTX({
                    kid: _identity.keys[0].kid,
                    transaction: tx,
                });
            } catch (error) {
                console.error(error.message);
            }
            const publicKey = _identity.did.split(":").pop();
            if (!publicKey) {
                throw Error("No public key");
            }
            const address = ethers.utils.computeAddress(publicKey);
            if (!address) {
                throw Error("Address from identity not correct");
            }
            // const address = await _wallet.getAddress();
            const CAIPAddress = `${selectedChain}:${address}`;
            const _accounts = [CAIPAddress];
            setAccounts(_accounts);
            setIdentity(_identity);
            console.log("Accounts => ", _accounts);
        };
        initWallet();
    }, [agent, selectedChain]);

    // Init Walletconnect client
    useEffect(() => {
        const initClient = async () => {
            try {
                console.log(`Starting Client...`);
                const _client = await Client.init({
                    controller: true,
                    relayProvider: DEFAULT_RELAY_PROVIDER,
                    metadata: DEFAULT_APP_METADATA,
                    storageOptions: {
                        asyncStorage: AsyncStorage as any,
                    },
                });
                console.log("Client started!");
                setClient(_client);
            } catch (e) {
                console.log("Failed to start Client!");
                console.error(e);
            }
        };
        initClient();
        return () => {
            console.log("Destroyed client");
        };
    }, []);

    // Navigate modal if you have requests or proposals
    useEffect(() => {
        if (requests.length > 0) {
            navigate("Modal");
        }
        if (proposals.length > 0) {
            navigate("Modal");
        }
    }, [requests, proposals]);

    const handlePruposal = useCallback(
        (_proposal: SessionTypes.Proposal) => {
            console.log("Proposal", _proposal);
            if (typeof client === "undefined") {
                return;
            }
            const unsupportedChains = [];
            _proposal.permissions.blockchain.chains.forEach((chainId) => {
                if (chains.includes(chainId)) {
                    return;
                }
                unsupportedChains.push(chainId);
            });
            if (unsupportedChains.length) {
                return client.reject({ proposal: _proposal });
            }
            const unsupportedMethods: string[] = [];
            _proposal.permissions.jsonrpc.methods.forEach((method) => {
                if (DEFAULT_EIP155_METHODS.includes(method)) {
                    return;
                }
                unsupportedMethods.push(method);
            });
            if (unsupportedMethods.length) {
                return client.reject({ proposal: _proposal });
            }
            setProposals((old) => [...old, _proposal]);
        },
        [chains, client]
    );

    const handleRequest = useCallback(
        (_requestEvent: SessionTypes.RequestEvent) => {
            console.log("GOT REQUEST", _requestEvent.request.params);
            setRequests((old) => [...old, _requestEvent]);
        },
        []
    );

    async function closeSession(topic: string) {
        if (!client) {
            throw new Error("Client is not initialized");
        }
        client.disconnect({
            topic: topic,
            reason: {
                message: "User closed session from app.",
                code: 123,
            },
        });
    }

    async function onApprove(
        event: SessionTypes.RequestEvent | SessionTypes.Proposal
    ) {
        if ("proposer" in event) {
            try {
                if (typeof client === "undefined") {
                    return;
                }
                const _accounts = accounts.filter((account) => {
                    const [namespace, reference] = account.split(":");
                    return event.permissions.blockchain.chains.includes(
                        `${namespace}:${reference}`
                    );
                });
                const response = {
                    state: { accounts: _accounts },
                };
                await client.approve({ proposal: event, response });
            } catch (e) {
                console.error(e);
            }
            setProposals(proposals.length > 1 ? proposals.slice(1) : []);
        } else if ("request" in event) {
            try {
                if (typeof client === "undefined") {
                    throw Error("Client not initialized on requst.");
                }
                if (!agent) {
                    throw Error("VeramoAgent not initialized on requst.");
                }

                //Default error
                let response: JsonRpcError | JsonRpcResponse =
                    formatJsonRpcError(
                        event.request.id,
                        "Unrecognised method not supported " +
                            event.request.method
                    );

                if (event.request.method === "eth_signTransaction") {
                    const kid = identity?.keys[0].kid;
                    if (!kid) {
                        throw Error("Could not resolve Veramo KID");
                    }
                    const tx = event.request.params[0];
                    delete tx.from;
                    const result = await agent.keyManagerSignEthTX({
                        kid: kid,
                        transaction: tx,
                    });
                    response = formatJsonRpcResult(event.request.id, result);
                }
                if (event.request.method === "did_createVerifiableCredential") {
                    console.log(
                        "requestEvent.request.params[0",
                        event.request.params[0]
                    );
                    if (!event.request.params[0].payload) {
                        throw Error("Requires payload parameter");
                    }
                    if (!event.request.params[0].verifier) {
                        throw Error("Requires verifier parameter");
                    }
                    const vc = await createVC(event.request.params[0].payload);
                    const vp = await createVP(
                        event.request.params[0].verifier,
                        [vc]
                    );
                    // TODO @Asbjørn - Put the VP through User auth
                    response = formatJsonRpcResult(
                        event.request.id,
                        vp.proof.jwt
                    );
                }

                await client.respond({
                    topic: event.topic,
                    response,
                });
            } catch (e) {
                console.error(e);
            }

            setRequests(requests.length > 1 ? requests.slice(1) : []);
        }
        goBack();
    }

    async function onReject(
        event: SessionTypes.RequestEvent | SessionTypes.Proposal
    ) {
        if ("proposer" in event) {
            try {
                if (typeof client === "undefined") {
                    return;
                }
                await client.reject({ proposal: event });
            } catch (e) {
                console.error(e);
            }
            setProposals(proposals.length > 1 ? proposals.slice(1) : []);
        } else if ("request" in event) {
            try {
                if (typeof client === "undefined") {
                    return;
                }
                const response = formatJsonRpcError(
                    event.request.id,
                    "User Rejected Request"
                );
                await client.respond({
                    topic: event.topic,
                    response,
                });
            } catch (e) {
                console.error(e);
            }
            setRequests(requests.length > 1 ? requests.slice(1) : []);
        }
        goBack();
    }

    // Subscribe Walletconnect
    useEffect(() => {
        const subscribeClient = async () => {
            try {
                if (!client) {
                    return;
                }
                console.log("Subscribiing Client...");
                client.on(CLIENT_EVENTS.session.proposal, handlePruposal);
                client.on(CLIENT_EVENTS.session.request, handleRequest);
                console.log("Subscribed pruposal");
                console.log("Subscribed request");
                setLoading(false);
            } catch (e) {
                console.log("Failed to subscribe Client!");
                console.error(e);
            }
        };
        subscribeClient();
        return () => {
            if (client) {
                client.removeListener(
                    CLIENT_EVENTS.session.proposal,
                    handlePruposal
                );
                client.removeListener(
                    CLIENT_EVENTS.session.request,
                    handleRequest
                );
            }
            console.log("Destroyed subscribe");
        };
    }, [client, chains, handlePruposal, handleRequest]);

    const createVC = async (data: Record<string, any>) => {
        if (!identity) {
            throw Error("Cant create VC, identity not initilized");
        }
        const vc = await agent.createVerifiableCredential({
            proofFormat: "jwt",
            save: true,
            credential: {
                type: ["VerifiableCredential", "PersonCredential"],
                credentialSubject: {
                    ...data,
                    id: identity?.did,
                },
                issuer: {
                    id: identity.did,
                },
            },
        });
        return vc;
    };

    const createVP = async (
        verifier: string,
        verifiableCredentials: VerifiableCredential[] | string[]
    ) => {
        if (!identity) {
            throw Error("Cant create VC, identity not initilized");
        }
        const vc = await agent.createVerifiablePresentation({
            presentation: {
                holder: identity.did,
                verifier: [verifier],
                verifiableCredential: verifiableCredentials,
            },
            proofFormat: "jwt",
        });
        return vc;
    };

    const decodeJWT = async (
        jwt: string,
        verifyOptions?: Partial<VerifyOptions>
    ) => {
        try {
            const valid = await verifyJWT(jwt);
            if (!valid) {
                console.error("TODO : Not valid JWT");
            }
            const payload = JSON.parse(
                Buffer.from(jwt.split(".")[1], "base64").toString()
            ) as JwtPayload;
            const errors = [];
            if (verifyOptions) {
                try {
                    const isVP =
                        "vp" in payload &&
                        payload.vp.type.includes("VerifiablePresentation");

                    if (verifyOptions.requireVerifiablePresentation && !isVP) {
                        throw Error(
                            "JWT is not a VerifiablePresentation, expected a JWT with vp property and VerifiablePresentation in vp.types "
                        );
                    }
                    if (verifyOptions.decodeCredentials) {
                        if (!Array.isArray(payload.vp.verifiableCredential)) {
                            errors.push(
                                `JWT vp.verifiableCredential was ${typeof payload
                                    .vp.verifiableCredential}, expected Array`
                            );
                        }
                        const decodedVerifiableCredentials = await Promise.all(
                            payload.vp.verifiableCredential.map(
                                async (subJWT: any) => {
                                    try {
                                        // Decode sub credential with overridden options,
                                        // REVIEW Is it correct to make sure VP issuer is subject of VC?
                                        const decoded = await decodeJWT(
                                            subJWT,
                                            {
                                                ...verifyOptions,
                                                decodeCredentials: false,
                                                audience: undefined,
                                                subject: payload.vp.iss,
                                                requireVerifiablePresentation:
                                                    false,
                                            }
                                        );
                                        return decoded;
                                    } catch (error) {
                                        errors.push(
                                            `Error decoding subcredential: ${
                                                error.message
                                            }. \nSubcredential was: \n${Buffer.from(
                                                subJWT.split(".")[1],
                                                "base64"
                                            ).toString()}`
                                        );
                                    }
                                }
                            )
                        );
                        payload.vp.JWTs =
                            decodedVerifiableCredentials as JwtPayload[];
                    }
                } catch (error) {
                    errors.push(
                        `JWT traited as Verifiable Presentation, error while decoding subcredential: ${error.message}`
                    );
                }

                if (verifyOptions.audience) {
                    if (typeof payload.aud === "string") {
                        if (payload.aud !== verifyOptions.audience) {
                            errors.push(
                                `JWT audience was ${payload.aud}, expected ${verifyOptions.audience}`
                            );
                        }
                    } else if (Array.isArray(payload.aud)) {
                        if (!payload.aud.includes(verifyOptions.audience)) {
                            errors.push(
                                `JWT audience was ${payload.aud.join(
                                    " | "
                                )}, expected one of ${verifyOptions.audience}`
                            );
                        }
                    } else {
                        throw Error(
                            `JWT .aud expected string or Array, got ${typeof payload.aud}`
                        );
                    }
                }
                if (verifyOptions.issuer) {
                    if (typeof payload.iss !== "string") {
                        throw Error(
                            `JWT issuer expected string, got ${typeof payload.iss}`
                        );
                    }
                    if (typeof verifyOptions.issuer === "string") {
                        if (payload.iss !== verifyOptions.issuer) {
                            errors.push(
                                `JWT issuer was ${payload.iss}, expected ${verifyOptions.issuer}`
                            );
                        }
                    } else if (Array.isArray(verifyOptions.issuer)) {
                        if (!verifyOptions.issuer.includes(payload.iss)) {
                            errors.push(
                                `JWT issuer was ${
                                    payload.iss
                                }, expected one of ${verifyOptions.issuer.join(
                                    " | "
                                )}`
                            );
                        }
                    } else {
                        errors.push(
                            `verifyOptions.issuer was ${typeof verifyOptions.issuer}, expected Array or string`
                        );
                    }
                }
                if (verifyOptions.subject) {
                    if (payload.sub !== verifyOptions.subject) {
                        errors.push(
                            `JWT subject was ${payload.sub}, expected ${verifyOptions.subject}`
                        );
                    }
                }
            }
            if (errors.length > 0) {
                throw Error(errors.join(".\n"));
            }
            return payload;
        } catch (error) {
            console.log("Cant decode JWT => ", error.message);
            throw error;
        }
    };

    const verifyJWT = async (jwt: string) => {
        try {
            await agent.handleMessage({
                raw: jwt,
            });
            return true;
        } catch (error) {
            console.log("JWT not valid => ", error);
            return false;
        }
    };

    /* Useage
      const result = await findVC({
            where: [{ column: "issuer", value: [someDID] }],
        });
    */
    const findVC = async (args: FindArgs<TCredentialColumns>) => {
        const credentials = await agent.dataStoreORMGetVerifiableCredentials(
            args
        );
        return credentials;
    };

    const saveVP = async (vp: VerifiablePresentation | string) => {
        if (typeof vp === "string") {
            vp = normalizePresentation(vp);
        }
        return await agent.dataStoreSaveVerifiablePresentation({
            verifiablePresentation: vp,
        });
    };

    // Make the context object:
    const context: IContext = {
        loading,
        chains,
        accounts,
        client,
        provider,
        proposals,
        setProposals,
        closeSession,
        requests,
        setRequests,
        onApprove,
        onReject,
        selectedChain,
        deleteVeramoData,
        createVC,
        createVP,
        decodeJWT,
        findVC,
        identity,
        saveVP,
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
