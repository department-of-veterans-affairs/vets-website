export const fetchAccountStatus: "fetchAccountStatus";
export const fetchAccountStatusSuccess: "fetchAccountStatusSuccess";
export const fetchAccountStatusFailed: "fetchAccountStatusFailed";
export default reducer;
declare function reducer(state: {
    data: {};
    error: boolean;
    loading: boolean;
}, action: any): {
    data: any;
    loading: boolean;
    error: boolean;
} | {
    data: {};
    error: any;
    loading: boolean;
};
