// Core interfaces
import {
    createAgent,
    IDataStore,
    IDIDManager,
    IKeyManager,
    IResolver,
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
import { createConnection } from "typeorm";

const DEFAULT_DID_PROVIDER = "did:ethr:arbitrumRinkeby";

const dbConnection = createConnection({
    type: "react-native",
    location: "default",
    database: "veramo.ios.sqlite",
    synchronize: true,
    logging: ["error", "info", "warn"],
    entities: Entities,
    name: "veramo.ios.sqlite",
});

const agentConfig = {
    plugins: [
        new KeyManager({
            store: new KeyStore(
                dbConnection,
                new SecretBox(
                    "29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c"
                )
            ),
            kms: {
                local: new KeyManagementSystem(),
            },
        }),
        new DIDManager({
            store: new DIDStore(dbConnection),
            defaultProvider: DEFAULT_DID_PROVIDER,
            providers: {
                "did:ethr:arbitrumRinkeby": new EthrDIDProvider({
                    defaultKms: "local",
                    network: "rinkeby",
                    rpcUrl: "https://arbitrum-rinkeby.infura.io/v3/d459cbc007fc49d2a44afbccc975e35c",
                    registry: "0x15a3dC1229115D69eeba3Eb6d0Cc34F84670f4e8",
                }),
            },
        }),
        new DIDResolverPlugin({
            resolver: new Resolver({
                ...ethrDidResolver({
                    provider: new ethers.providers.JsonRpcProvider({
                        url: "https://arbitrum-rinkeby.infura.io/v3/d459cbc007fc49d2a44afbccc975e35c",
                    }),
                    registry: "0x15a3dC1229115D69eeba3Eb6d0Cc34F84670f4e8",
                    chainId: 421611,
                    name: "arbitrumRinkeby",
                }),
            }),
        }),
        new CredentialIssuer(),
        new MessageHandler({
            messageHandlers: [new JwtMessageHandler(), new W3cMessageHandler()],
        }),
        new DataStore(dbConnection),
        new DataStoreORM(dbConnection),
    ],
};

export const agent = createAgent<
    IDIDManager &
        IKeyManager &
        IDataStore &
        IDataStoreORM &
        IResolver &
        ICredentialIssuer
>(agentConfig);
