export const HEALTH_TOOL_HEADINGS: Readonly<{
    APPOINTMENTS: "Appointments";
    MESSAGES: "Messages";
    MEDICATIONS: "Medications";
    MEDICAL_RECORDS: "Medical records";
    PAYMENTS: "Payments";
    MEDICAL_SUPPLIES: "Medical supplies";
}>;
export const HEALTH_TOOL_NAMES: readonly ("Appointments" | "Messages" | "Medications" | "Medical records" | "Payments" | "Medical supplies")[];
export const HEALTH_TOOL_LINKS: Readonly<{
    APPOINTMENTS: readonly {
        href: string;
        text: string;
    }[];
    MESSAGES: readonly {
        href: string;
        text: string;
    }[];
    MEDICATIONS: readonly {
        href: string;
        text: string;
    }[];
    MEDICAL_RECORDS: readonly {
        href: string;
        text: string;
    }[];
    PAYMENTS: readonly ({
        href: string;
        text: string;
        isExternal?: undefined;
    } | {
        href: string;
        text: string;
        isExternal: boolean;
    })[];
    MEDICAL_SUPPLIES: readonly {
        href: string;
        text: string;
    }[];
}>;
export const HEALTH_TOOLS: {
    name: "Appointments" | "Messages" | "Medications" | "Medical records" | "Payments" | "Medical supplies";
    links: any;
}[];
export const MHV_ACCOUNT_CARDS: ("Messages" | "Medications" | "Medical records")[];
