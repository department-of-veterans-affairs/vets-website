export function countUnreadMessages(folders: any): any;
export function isLinkData(x: any): boolean;
export function resolveLandingPageLinks(authdWithSSOe: boolean, featureToggles: any, unreadMessageAriaLabel: any, registered?: boolean): {
    cards: ({
        title: "Appointments";
        icon: string;
        links: readonly {
            href: string;
            text: string;
        }[];
        iconClasses?: undefined;
    } | {
        title: "Messages";
        icon: string;
        links: {
            href: string;
            text: string;
        }[];
        iconClasses?: undefined;
    } | {
        title: "Medications";
        icon: string;
        links: readonly {
            href: string;
            text: string;
        }[];
        iconClasses?: undefined;
    } | {
        links: {
            href: string;
            text: string;
        }[];
        introduction: string;
        title: "Medical records";
        icon: string;
        iconClasses?: undefined;
    } | {
        title: "Payments";
        icon: string;
        iconClasses: string;
        links: ({
            href: string;
            text: string;
            isExternal?: undefined;
        } | {
            href: string;
            text: string;
            isExternal: boolean;
        })[];
    } | {
        title: "Medical supplies";
        icon: string;
        links: readonly {
            href: string;
            text: string;
        }[];
        iconClasses?: undefined;
    })[];
    hubs: {
        title: string;
        links: {
            href: any;
            text: string;
        }[];
    }[];
    nonPatientHubs: {
        title: string;
        links: {
            text: string;
            href: any;
        }[];
    }[];
    healthResourcesLinks: {
        href: string;
        text: string;
    }[];
};
export function resolveUnreadMessageAriaLabel(unreadMessageCount: any): string;
