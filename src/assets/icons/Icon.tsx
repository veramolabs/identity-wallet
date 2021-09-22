import React from "react";
import { SvgXml, XmlProps } from "react-native-svg";
import {
    Account,
    Bug,
    Developer,
    Help,
    Home,
    Lock,
    NextArrow,
    Person,
    Policy,
    Qr,
    Settings,
    Star,
} from ".";

export type IconType =
    | "home"
    | "person"
    | "account"
    | "bug"
    | "developer"
    | "next-arrow"
    | "help"
    | "lock"
    | "settings"
    | "star"
    | "qr"
    | "policy";

interface Props {
    type: IconType;
    size: number;
    color: string;
}

const getSvgXmlForType = (type: IconType) => {
    let tmp;
    switch (type) {
        case "home":
            tmp = Home;
        case "person":
            tmp = Person;
            break;
        case "account":
            tmp = Account;
            break;
        case "bug":
            tmp = Bug;
            break;
        case "developer":
            tmp = Developer;
            break;
        case "next-arrow":
            tmp = NextArrow;
            break;
        case "help":
            tmp = Help;
            break;
        case "lock":
            tmp = Lock;
            break;
        case "settings":
            tmp = Settings;
            break;
        case "policy":
            tmp = Policy;
            break;
        case "star":
            tmp = Star;
            break;
        case "qr":
            tmp = Qr;
            break;
        default:
            tmp = Person;
            break;
    }
    return tmp;
};

export const Icon: React.FC<Props & Omit<XmlProps, "fill" | "xml">> = ({
    ...props
}) => {
    const icon = getSvgXmlForType(props.type);
    return (
        <SvgXml
            xml={icon}
            width={props.size}
            height={props.size}
            fill={props.color}
            style={props.style}
        />
    );
};
