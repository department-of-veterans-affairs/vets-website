export function accountSuccess(req: any, res: any): any;
export function eightZeroOne(req: any, res: any): any;
export function eightZeroFive(req: any, res: any): any;
export function eightZeroSix(req: any, res: any): any;
export function fiveZeroZero(req: any, res: any): any;
export function multiError(req: any, res: any): any;
export namespace accountStatusSuccessResponse {
    namespace data {
        let id: string;
        let type: string;
        namespace attributes {
            let userProfileId: string;
            let premium: boolean;
            let champVa: boolean;
            let patient: boolean;
            let smAccountCreated: boolean;
            let message: string;
        }
    }
}
export namespace accountStatusEightZeroOne {
    let errors: {
        title: string;
        detail: string;
        code: number;
    }[];
}
export namespace accountStatusFiveZeroZero {
    let errors_1: {
        title: string;
        detail: string;
        code: number;
    }[];
    export { errors_1 as errors };
}
export namespace accountStatusFourTwoTwo {
    let errors_2: {
        title: string;
        detail: string;
    }[];
    export { errors_2 as errors };
}
export namespace accountStatusMultiError {
    let errors_3: {
        title: string;
        detail: string;
        code: number;
    }[];
    export { errors_3 as errors };
}
