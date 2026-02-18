const initialState = {
  loading: false,
  successfulDownload: false,
  failedDownload: false,
  failedDomains: [],
};

export const GET_SEI_PDF = 'GET_SEI_PDF';
export const GET_SEI_PDF_SUCCESS = 'GET_SEI_PDF_SUCCESS';
export const GET_SEI_PDF_FAILED = 'GET_SEI_PDF_FAILED';

const seiPdfReducer = (state = initialState, action) => {
  const { failedDomains, type } = action;
  switch (type) {
    case GET_SEI_PDF:
      return { ...state, loading: true };
    case GET_SEI_PDF_SUCCESS:
      return {
        ...state,
        loading: false,
        successfulDownload: true,
        failedDownload: false,
        failedDomains,
      };
    case GET_SEI_PDF_FAILED:
      return {
        ...state,
        loading: false,
        failedDownload: true,
        successfulDownload: false,
      };
    default:
      return state;
  }
};

export default seiPdfReducer;
