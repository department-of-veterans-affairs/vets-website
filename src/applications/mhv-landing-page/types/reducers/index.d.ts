declare namespace _default {
    export { myHealth };
}
export default _default;
declare const myHealth: import("redux").Reducer<import("redux").CombinedState<{
    accountStatus: {
        data: any;
        loading: boolean;
        error: boolean;
    } | {
        data: {};
        error: any;
        loading: boolean;
    };
    militaryServicePdf: {
        loading: boolean;
        successfulDownload: boolean;
        failedDownload: boolean;
        error: any;
    };
    seiPdf: {
        loading: boolean;
        successfulDownload: boolean;
        failedDownload: boolean;
        failedDomains: any;
    };
}>, import("redux").AnyAction>;
