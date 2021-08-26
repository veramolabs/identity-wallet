import { BROK_HELPERS_URL } from "@env";
import { VerifiablePresentation } from "@veramo/core";
import axios, { AxiosResponse } from "axios";

export interface ForvaltRepository {
    registerWithBankId(
        vp: VerifiablePresentation
    ): Promise<AxiosResponse<string>>;
}

export class ForvaltRepositoryImpl implements ForvaltRepository {
    registerWithBankId(
        vp: VerifiablePresentation
    ): Promise<AxiosResponse<string>> {
        return axios.post<string>(
            `${
                false ? "http://localhost:3004" : BROK_HELPERS_URL
            }/brreg/entity/register`,
            {
                jwt: vp.proof.jwt,
                skipBlockchain: false,
                skipBankidVerify: false,
            }
        );
    }
}
