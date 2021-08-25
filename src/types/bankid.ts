export interface BankidJWTPayload {
    iss: string;
    aud: string;
    identityscheme: string;
    authenticationtype: string;
    authenticationmethod: string;
    authenticationinstant: Date;
    nameidentifier: string;
    sub: string;
    sessionindex: string;
    uniquemerchantid: string;
    uniqueuserid: string;
    certsubject: string;
    certissuer: string;
    issuer: string;
    dateofbirth: string;
    socialno: string;
    serialnumber: string;
    country: string;
    issuingbank: string;
    name: string;
    given_name: string;
    family_name: string;
    iat: number;
    nbf: number;
    exp: number;
}
