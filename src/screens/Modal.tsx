import React, { useContext } from "react";

import { Proposal } from "./../components/modals/Proposal";
import { Request } from "./../components/modals/Request";

import { Context } from "../context";

const Modal = () => {
    const { proposal, request, onApprove, onReject } = useContext(Context);
    if (typeof proposal !== "undefined") {
        return (
            <Proposal
                proposal={proposal}
                onApprove={onApprove}
                onReject={onReject}
            />
        );
    } else if (typeof request !== "undefined") {
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
