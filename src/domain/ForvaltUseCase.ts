import { VerifiablePresentation } from "@veramo/core";
import { AxiosResponse } from "axios";
import { ForvaltRepository } from "./ForvaltRepository";

export interface ForvaltService {
    registerVpInForvalt(vp: VerifiablePresentation): Promise<AxiosResponse>;
}

export class ForvaltServiceImpl implements ForvaltService {
    forvaltRepo: ForvaltRepository;

    constructor(forvaltRepo: ForvaltRepository) {
        this.forvaltRepo = forvaltRepo;
    }
    saveVpInVeramo(vp: VerifiablePresentation): Promise<string> {
        throw new Error("Method not implemented.");
    }

    registerVpInForvalt(vp: VerifiablePresentation): Promise<AxiosResponse> {
        return this.forvaltRepo
            .registerWithBankId(vp)
    }

}
