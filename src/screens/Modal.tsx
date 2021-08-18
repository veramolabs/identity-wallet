import React, { useContext } from "react";

import { Proposal } from "./../components/modals/Proposal";
import { Request } from "./../components/modals/Request";

import { Context } from "../context";

const Modal = () => {
    const { proposal, request, onApprove, onReject } = useContext(Context);
    if (proposal) {
        return (
            <Proposal
                proposal={proposal}
                onApprove={onApprove}
                onReject={onReject}
            />
        );
    } else if (request) {
        return (
            <Request
                request={request}
                onApprove={onApprove}
                onReject={onReject}
            />
        );
    } else {
        return null;
    }
};

export default Modal;
