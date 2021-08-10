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
