export const GET_MILITARY_SERVICE_PDF: "GET_MILITARY_SERVICE_PDF";
export const GET_MILITARY_SERVICE_PDF_SUCCESS: "GET_MILITARY_SERVICE_PDF_SUCCESS";
export const GET_MILITARY_SERVICE_PDF_FAILED: "GET_MILITARY_SERVICE_PDF_FAILED";
export default militaryServicePdfReducer;
declare function militaryServicePdfReducer(state: {
    loading: boolean;
    successfulDownload: boolean;
    failedDownload: boolean;
    error: boolean;
}, action: any): {
    loading: boolean;
    successfulDownload: boolean;
    failedDownload: boolean;
    error: any;
};
