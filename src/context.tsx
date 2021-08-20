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
import {
    IDataStore,
    IDIDManager,
    IKeyManager,
    IResolver,
    TAgent,
} from "@veramo/core";
import { ICredentialIssuer } from "@veramo/credential-w3c";
import { IDataStoreORM } from "@veramo/data-store";
import Client, { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { ethers, Wallet } from "ethers";
import React, { createContext, useEffect, useState } from "react";
import { agent as _agent } from "./components/veramo/VeramoUtils";
import {
    DEFAULT_APP_METADATA,
    DEFAULT_EIP155_METHODS,
    DEFAULT_RELAY_PROVIDER,
    DEFAULT_TEST_CHAINS,
} from "./constants/default";
import { goBack, navigate } from "./navigation";

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
    wallet: Wallet | undefined;
    client: Client | undefined;
    proposal: SessionTypes.Proposal | undefined;
    setProposal: Dispatch<SessionTypes.Proposal | undefined>;
    request: SessionTypes.RequestEvent | undefined;
    setRequest: Dispatch<SessionTypes.RequestEvent | undefined>;
    onApprove: () => Promise<void>;
    onReject: () => Promise<void>;
    selectedChain: string;
}

export const INITIAL_CONTEXT: IContext = {
    loading: false,
    chains: [],
    accounts: [],
    wallet: undefined,
    client: undefined,
    proposal: undefined,
    setProposal: () => {},
    request: undefined,
    setRequest: () => {},
    onApprove: async () => {},
    onReject: async () => {},
    selectedChain: undefined!,
};
export const Context = createContext<IContext>(INITIAL_CONTEXT);

export const ContextProvider = (props: any) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [chains] = useState<string[]>(DEFAULT_TEST_CHAINS);
    const [selectedChain, setSelectedChain] = useState(DEFAULT_TEST_CHAINS[0]);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
    const [client, setClient] = useState<Client | undefined>(undefined);
    const [proposal, setProposal] = useState<SessionTypes.Proposal | undefined>(
        undefined
    );
    const [requestEvent, setRequest] = useState<
        SessionTypes.RequestEvent | undefined
    >(undefined);

    // Veramo
    const [agent] = useState<Agent>(_agent);

    useEffect(() => {
        const getIdentity = async () => {
            const createIdentity = async () => {
                const identity = await agent.didManagerCreate({
                    kms: "Documents",
                });
                return identity;
            };
            const identifiers = await agent.didManagerFind();
            if (identifiers.length === 0) {
                return createIdentity();
            }
            return identifiers[0];
        };
        const initWallet = async () => {
            // const db = await SQLite.openDatabase({
            //     name: "veramo.ios.sqlite",
            //     location: "default",
            // });
            // db.transaction((tx) => {
            //     tx.executeSql(
            //         "SELECT * FROM information_schema.tables;",
            //         [],
            //         (result) => console.log("result2", result)
            //     );
            // });
            // console.log("DB , ", db);

            console.log(`Starting Wallet...`);

            const identity = await getIdentity();
            console.log(identity);
            const privateKey = identity.keys.find((key) => {
                return key.type === "Secp256k1";
            })?.privateKeyHex;
            if (!privateKey) {
                throw Error("No Secp256k1 key generated from Veramo.");
            }
            console.log("PK => ", privateKey);
            // TODO PK is encrypted
            // const _wallet = new Wallet(privateKey);
            const _wallet = Wallet.createRandom();

            const address = await _wallet.getAddress();
            const CAIPAddress = `${selectedChain}:${address}`;
            const _accounts = [CAIPAddress];

            setAccounts(_accounts);
            setWallet(
                _wallet.connect(
                    new ethers.providers.JsonRpcProvider({
                        url: "https://arbitrum-rinkeby.infura.io/v3/eaa35471bb7947adb685b17daa1030d4",
                    })
                )
            );
            console.log("Wallet started! Accounts => ", _accounts);
        };
        initWallet();
    }, [agent, selectedChain]);

    useEffect(() => {
        const initClient = async () => {
            console.log(`Starting Client...`);
            try {
                await AsyncStorage.clear();
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
                setLoading(false);
            } catch (e) {
                console.log("Failed to start Client!");
                console.error(e);
            }
        };
        initClient();
        return () => {
            console.log("Destroyeed client");
        };
    }, []);

    useEffect(() => {
        const subscribeClient = async () => {
            try {
                if (!client) {
                    return;
                }
                if (!wallet) {
                    return;
                }
                if (loading) {
                    return;
                }
                console.log("Subscribing Client...");
                client.on(
                    CLIENT_EVENTS.session.proposal,
                    (_proposal: SessionTypes.Proposal) => {
                        console.log("Proposal", _proposal);
                        if (typeof client === "undefined") {
                            return;
                        }
                        const unsupportedChains = [];
                        _proposal.permissions.blockchain.chains.forEach(
                            (chainId) => {
                                if (chains.includes(chainId)) {
                                    return;
                                }
                                unsupportedChains.push(chainId);
                            }
                        );
                        if (unsupportedChains.length) {
                            return client.reject({ proposal: _proposal });
                        }
                        const unsupportedMethods: string[] = [];
                        _proposal.permissions.jsonrpc.methods.forEach(
                            (method) => {
                                if (DEFAULT_EIP155_METHODS.includes(method)) {
                                    return;
                                }
                                unsupportedMethods.push(method);
                            }
                        );
                        console.log("unsupportedMethods", unsupportedMethods);
                        if (unsupportedMethods.length) {
                            return client.reject({ proposal: _proposal });
                        }
                        setProposal(_proposal);
                        navigate("Modal");
                    }
                );

                client.on(
                    CLIENT_EVENTS.session.request,
                    async (_requestEvent: SessionTypes.RequestEvent) => {
                        console.log("Received request:", _requestEvent);
                        if (typeof wallet === "undefined") {
                            throw new Error("Wallet is not initialized");
                        }

                        try {
                            setRequest(_requestEvent);
                            navigate("Modal");
                        } catch (e) {
                            const response = formatJsonRpcError(
                                _requestEvent.request.id,
                                e.message
                            );
                            await client.respond({
                                topic: _requestEvent.topic,
                                response,
                            });
                        }
                    }
                );
            } catch (e) {
                console.log("Failed to subscribe Client!");
                console.error(e);
            }
        };
        subscribeClient();
        return () => {
            console.log("Destroyed subscribe");
        };
    }, [client, wallet, chains, loading]);

    async function onApprove() {
        if (typeof proposal !== "undefined") {
            try {
                if (typeof client === "undefined") {
                    return;
                }
                const _accounts = accounts.filter((account) => {
                    const [namespace, reference] = account.split(":");
                    return proposal.permissions.blockchain.chains.includes(
                        `${namespace}:${reference}`
                    );
                });
                const response = {
                    state: { accounts: _accounts },
                };
                await client.approve({ proposal, response });
            } catch (e) {
                console.error(e);
            }
            setProposal(undefined);
        } else if (typeof requestEvent !== "undefined") {
            try {
                if (typeof client === "undefined") {
                    return;
                }
                if (typeof wallet === "undefined") {
                    return;
                }
                const chainId = requestEvent.chainId || chains[0];

                //Default error
                let response: JsonRpcError | JsonRpcResponse =
                    formatJsonRpcError(
                        requestEvent.request.id,
                        "Unrecognised method not supported " +
                            requestEvent.request.method
                    );

                if (requestEvent.request.method === "eth_signTransaction") {
                    const result = await wallet.signTransaction(
                        requestEvent.request.params[0]
                    );

                    response = formatJsonRpcResult(
                        requestEvent.request.id,
                        result
                    );
                }

                await client.respond({
                    topic: requestEvent.topic,
                    response,
                });
            } catch (e) {
                console.error(e);
            }
            setRequest(undefined);
        }
        goBack();
    }

    async function onReject() {
        if (typeof proposal !== "undefined") {
            try {
                if (typeof client === "undefined") {
                    return;
                }
                await client.reject({ proposal });
            } catch (e) {
                console.error(e);
            }
            setProposal(undefined);
        } else if (typeof requestEvent !== "undefined") {
            try {
                if (typeof client === "undefined") {
                    return;
                }
                const response = formatJsonRpcError(
                    requestEvent.request.id,
                    "User Rejected Request"
                );
                await client.respond({
                    topic: requestEvent.topic,
                    response,
                });
            } catch (e) {
                console.error(e);
            }
            setRequest(undefined);
        }
        goBack();
    }

    // Make the context object:
    const context: IContext = {
        loading,
        chains,
        accounts,
        wallet,
        client,
        proposal,
        setProposal,
        request: requestEvent,
        setRequest,
        onApprove,
        onReject,
        selectedChain,
    };

    // pass the value in provider and return
    return (
        <Context.Provider value={context}>{props.children}</Context.Provider>
    );
};

export const { Consumer } = Context;
