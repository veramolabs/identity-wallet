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
import Client, { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { ethers, Wallet } from "ethers";
import { KeyValueStorage } from "keyvaluestorage";
import React, { createContext, useEffect, useState } from "react";
import {
    DEFAULT_APP_METADATA,
    DEFAULT_EIP155_METHODS,
    DEFAULT_RELAY_PROVIDER,
    DEFAULT_TEST_CHAINS,
} from "./constants/default";
import { goBack, navigate } from "./navigation";

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
        undefined,
    );
    const [requestEvent, setRequest] = useState<
        SessionTypes.RequestEvent | undefined
    >(undefined);

    useEffect(() => {
        const initWallet = async () => {
            console.log(`Starting Wallet...`);
            const storage = new KeyValueStorage({
                asyncStorage: AsyncStorage as any,
            });
            const persistedMnemonic = await storage.getItem("mnemonic");
            if (!persistedMnemonic) {
                console.log("Did not find mnemonic, creating new one");
                const newWallet = Wallet.createRandom();
                await storage.setItem("mnemonic", newWallet.mnemonic.phrase);
            }
            const mnemonic = await storage.getItem("mnemonic");
            if (!mnemonic) {
                throw Error("Could not fetch mnemonic from async storage");
            }
            const _wallet = Wallet.fromMnemonic(mnemonic);

            const address = await _wallet.getAddress();
            const CAIPAddress = `${selectedChain}:${address}`;
            const _accounts = [CAIPAddress];

            setAccounts(_accounts);
            setWallet(
                _wallet.connect(
                    new ethers.providers.JsonRpcProvider({
                        url: "https://arbitrum-rinkeby.infura.io/v3/eaa35471bb7947adb685b17daa1030d4",
                    }),
                ),
            );
            console.log(_accounts);
            // todo only test
            setTimeout(() => {
                setLoading(false);
            }, 500);
        };
        initWallet();
    }, [selectedChain]);

    useEffect(() => {
        const initClient = async () => {
            console.log(`Starting Client...`);
            try {
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
                            },
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
                            },
                        );
                        console.log("unsupportedMethods", unsupportedMethods);
                        if (unsupportedMethods.length) {
                            return client.reject({ proposal: _proposal });
                        }
                        setProposal(_proposal);
                        navigate("Modal");
                    },
                );

                client.on(
                    CLIENT_EVENTS.session.request,
                    async (requestEvent: SessionTypes.RequestEvent) => {
                        console.log("Received request:", requestEvent);
                        if (typeof wallet === "undefined") {
                            throw new Error("Wallet is not initialized");
                        }

                        try {
                            setRequest(requestEvent);
                            navigate("Modal");
                        } catch (e) {
                            const response = formatJsonRpcError(
                                requestEvent.request.id,
                                e.message,
                            );
                            await client.respond({
                                topic: requestEvent.topic,
                                response,
                            });
                        }
                    },
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
                        `${namespace}:${reference}`,
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
                            requestEvent.request.method,
                    );

                if (requestEvent.request.method === "eth_signTransaction") {
                    const result = await wallet.signTransaction(
                        requestEvent.request.params[0],
                    );

                    response = formatJsonRpcResult(
                        requestEvent.request.id,
                        result,
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
                    "User Rejected Request",
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
