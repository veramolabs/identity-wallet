import { Wallet } from "ethers";
import { SessionTypes } from "@walletconnect/types";
import Client from "@walletconnect/client";
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
};
