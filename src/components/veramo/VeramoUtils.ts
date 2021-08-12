// Core interfaces
import {
    createAgent,
    IDataStore,
    IDIDManager,
    IKeyManager,
    IResolver,
    TAgent,
} from "@veramo/core";
import {
    CredentialIssuer,
    ICredentialIssuer,
    W3cMessageHandler,
} from "@veramo/credential-w3c";
// Storage plugin using TypeOrm
import {
    DataStore,
    DataStoreORM,
    DIDStore,
    Entities,
    IDataStoreORM,
    KeyStore,
} from "@veramo/data-store";
import { JwtMessageHandler } from "@veramo/did-jwt";
import { DIDManager } from "@veramo/did-manager";
import { EthrDIDProvider } from "@veramo/did-provider-ethr";
import { getDidKeyResolver, KeyDIDProvider } from "@veramo/did-provider-key";
// Custom resolvers
import { DIDResolverPlugin } from "@veramo/did-resolver";
// Core key manager plugin
import { KeyManager } from "@veramo/key-manager";
// Custom key management system for RN
import { KeyManagementSystem, SecretBox } from "@veramo/kms-local";
// Core identity manager plugin
import { MessageHandler } from "@veramo/message-handler";
import { Resolver } from "did-resolver";
import { ethers } from "ethers";
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
// TypeORM is installed with `@veramo/data-store`
import { Connection, createConnection } from "typeorm";

export function getDbConnection(databaseFileName: string) {
    return createConnection({
        type: "react-native",
        location: "default",
        database: databaseFileName,
        synchronize: true,
        logging: ["error", "info", "warn"],
        entities: Entities,
        name: databaseFileName,
    });
}

export function getAgentConfig(
    dbConnection: Promise<Connection>,
    defaultDidProvider: string,
    secretKey?: string,
) {
    return {
        plugins: [
            new KeyManager({
                store: secretKey
                    ? new KeyStore(
                          dbConnection,
                          new SecretBox(
                              "29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c",
                          ),
                      )
                    : new KeyStore(dbConnection),
                kms: {
                    local: new KeyManagementSystem(),
                },
            }),
            new DIDManager({
                store: new DIDStore(dbConnection),
                defaultProvider: defaultDidProvider,
                providers: {
                    "did:ethr:brok": new EthrDIDProvider({
                        defaultKms: "local",
                        network: "brok",
                        rpcUrl: "https://e0avzugh9j:5VOuyz9VPLenxC-zB2nvrWOlfDrRlSlcg0VZyIAvEeI@e0mvr9jrs7-e0iwsftiw5-rpc.de0-aws.kaleido.io",
                        registry: "0x28e1b9Be7aDb104ef1989821e5Cb1d6eB4294eA6",
                    }),
                    "did:key": new KeyDIDProvider({
                        defaultKms: "local",
                    }),
                },
            }),
            new DIDResolverPlugin({
                resolver: new Resolver({
                    ...getDidKeyResolver(),
                    ...ethrDidResolver({
                        // rpcUrl: 'https://e0avzugh9j:5VOuyz9VPLenxC-zB2nvrWOlfDrRlSlcg0VZyIAvEeI@e0mvr9jrs7-e0iwsftiw5-rpc.de0-aws.kaleido.io',
                        provider: new ethers.providers.JsonRpcProvider({
                            url: "https://e0mvr9jrs7-e0iwsftiw5-rpc.de0-aws.kaleido.io",
                            user: "e0avzugh9j",
                            password:
                                "5VOuyz9VPLenxC-zB2nvrWOlfDrRlSlcg0VZyIAvEeI",
                        }),
                        registry: "0x28e1b9Be7aDb104ef1989821e5Cb1d6eB4294eA6",
                        chainId: 7766,
                        name: "brok",
                    }),
                }),
            }),
            new CredentialIssuer(),
            new MessageHandler({
                messageHandlers: [
                    new JwtMessageHandler(),
                    new W3cMessageHandler(),
                ],
            }),
            new DataStore(dbConnection),
            new DataStoreORM(dbConnection),
        ],
    };
}

export function initAgent(
    dbConnection: Promise<Connection>,
    _args: {
        defaultDidProvider?: string;
        secretKey?: string;
    } = {},
): TAgent<
    IDIDManager &
        IKeyManager &
        IDataStore &
        IDataStoreORM &
        IResolver &
        ICredentialIssuer
> {
    const args = { defaultDidProvider: "did:ethr:brok", ..._args };
    const agentConfig = getAgentConfig(
        dbConnection,
        args.defaultDidProvider,
        args.secretKey,
    );
    return createAgent<
        IDIDManager &
            IKeyManager &
            IDataStore &
            IDataStoreORM &
            IResolver &
            ICredentialIssuer
    >(agentConfig);
}
