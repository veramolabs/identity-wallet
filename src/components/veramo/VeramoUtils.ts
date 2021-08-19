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
import { getResolver as ethrDidResolver } from "ethr-did-resolver";
// TypeORM is installed with `@veramo/data-store`
import { createConnection } from "typeorm";

const DEFAULT_DID_PROVIDER = "did:ethr:rinkeby";

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
                "did:ethr:rinkeby": new EthrDIDProvider({
                    defaultKms: "local",
                    network: "rinkeby",
                    rpcUrl: "https://rinkeby.infura.io/v3/eaa35471bb7947adb685b17daa1030d4",
                }),
            },
        }),
        new DIDResolverPlugin({
            resolver: new Resolver({
                ...ethrDidResolver({
                    infuraProjectId: "eaa35471bb7947adb685b17daa1030d4",
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
