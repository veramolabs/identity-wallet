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

// TODO : Must make default DID provider inherit from selected chain in context
const CHAIN_ID = "eip155:421611";
const DEFAULT_DID_PROVIDER = `did:ethr:${CHAIN_ID}`;

const dbConnection = createConnection({
    type: "react-native",
    location: "default",
    database: "VERAMO_DATABASE.sqlite.db",
    synchronize: true,
    logging: ["error", "info", "warn"],
    entities: Entities,
    name: "VERAMO_NAME.sqlite.db",
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
                DEFAULT_DID_PROVIDER: new EthrDIDProvider({
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
                    name: CHAIN_ID,
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
