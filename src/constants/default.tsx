export const DEFAULT_APP_METADATA = {
    name: "Identity Wallet",
    description: "Identity Wallet from Symfoni",
    url: "https://walletconnect.org/",
    icons: ["https://walletconnect.org/walletconnect-logo.png"],
};

export const DEFAULT_MAIN_CHAINS = [
    // mainnets
    "eip155:1",
    "eip155:10",
    "eip155:100",
    "eip155:137",
];

export const DEFAULT_TEST_CHAINS = ["eip155:421611"];

export const DEFAULT_CHAINS = [...DEFAULT_MAIN_CHAINS, ...DEFAULT_TEST_CHAINS];

export const DEFAULT_RELAY_PROVIDER = "wss://relay.walletconnect.org";

export const DEFAULT_EIP155_METHODS = [
    "eth_sendTransaction",
    "personal_sign",
    "eth_signTypedData",
];

export const DEFAULT_LOGGER = "debug";
