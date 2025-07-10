export const GET_SEI_PDF: "GET_SEI_PDF";
export const GET_SEI_PDF_SUCCESS: "GET_SEI_PDF_SUCCESS";
export const GET_SEI_PDF_FAILED: "GET_SEI_PDF_FAILED";
export default seiPdfReducer;
declare function seiPdfReducer(state: {
    loading: boolean;
    successfulDownload: boolean;
    failedDownload: boolean;
    failedDomains: any[];
}, action: any): {
    loading: boolean;
    successfulDownload: boolean;
    failedDownload: boolean;
    failedDomains: any;
};
