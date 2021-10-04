import { IconType } from "../../assets/icons/Icon";
import { SymfoniColorPicker } from "../../components/ColorPicker";
import { Developer } from "./Developer";
import { Help } from "./Help";
import { Legal } from "./Legal";
import { Rating } from "./Rating";
import { Report } from "./Report";
import { Security } from "./Security";
import { Settings } from "./Settings";

export interface ProfileMenuRoute {
    component: React.FunctionComponent;
    routeId: string;
    title: string;
    subtitle?: string;
    icon: IconType;
    kind: string;
}

interface Divider {
    kind: string;
}

const security: ProfileMenuRoute = {
    component: Security,
    routeId: "Security",
    title: "Sikkerhet",
    subtitle: "Trusted apps",
    icon: "lock",
    kind: "item",
};
const settings: ProfileMenuRoute = {
    component: Settings,
    routeId: "Settings",
    title: "Innstillinger",
    subtitle: "Notifikasjoner, etc.....",
    icon: "settings",
    kind: "item",
};
const developer: ProfileMenuRoute = {
    component: Developer,
    routeId: "Developer",
    title: "Utvikler",
    icon: "developer",
    kind: "item",
};

const help: ProfileMenuRoute = {
    component: Help,
    routeId: "Help",
    title: "Hjelp og support",
    icon: "help",
    kind: "item",
};

const report: ProfileMenuRoute = {
    component: Report,
    routeId: "Report",
    title: "Rapporter feil",
    icon: "bug",
    kind: "item",
};

const legal: ProfileMenuRoute = {
    component: Legal,
    routeId: "Legal",
    title: "Legal",
    icon: "policy",
    kind: "item",
};

const rating: ProfileMenuRoute = {
    component: Rating,
    routeId: "Rate",
    title: "Ranger appen",
    icon: "star",
    kind: "item",
};

const colorPicker: ProfileMenuRoute = {
    component: SymfoniColorPicker,
    routeId: "ColorPicker",
    title: "Fargevalg",
    icon: "developer",
    kind: "item",
};

export type Item = ProfileMenuRoute | Divider;

export const isDivider = (item: Item): boolean => {
    return item.kind === "divider";
};

export const PROFILE_ROUTES: Item[] = [
    { kind: "divider" } as Divider,
    security,
    settings,
    { kind: "divider" } as Divider,
    help,
    report,
    legal,
    { kind: "divider" } as Divider,
    rating,
    developer,
    colorPicker,
];