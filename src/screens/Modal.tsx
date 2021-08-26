import React, { useContext, useEffect } from "react";
import { Context } from "../context";
import { Proposal } from "./../components/modals/Proposal";
import { Request } from "./../components/modals/Request";

const Modal = () => {
    const { proposals, requests, onApprove, onReject } = useContext(Context);

    useEffect(() => {
        console.log("Request updated", requests.length);
    }, [requests]);

    if (proposals.length > 0) {
        return (
            <Proposal
                proposal={proposals[0]}
                onApprove={onApprove}
                onReject={onReject}
            />
        );
    } else if (requests.length > 0) {
        return (
            <Request
                request={requests[0]}
                onApprove={onApprove}
                onReject={onReject}
            />
        );
    } else {
        return null;
    }
};

export default Modal;
