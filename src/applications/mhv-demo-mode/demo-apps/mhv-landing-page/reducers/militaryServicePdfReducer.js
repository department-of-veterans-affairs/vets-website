const initialState = {
  loading: false,
  successfulDownload: false,
  failedDownload: false,
  error: false,
};

export const GET_MILITARY_SERVICE_PDF = 'GET_MILITARY_SERVICE_PDF';
export const GET_MILITARY_SERVICE_PDF_SUCCESS =
  'GET_MILITARY_SERVICE_PDF_SUCCESS';
export const GET_MILITARY_SERVICE_PDF_FAILED =
  'GET_MILITARY_SERVICE_PDF_FAILED';

const militaryServicePdfReducer = (state = initialState, action) => {
  const { error, type } = action;
  switch (type) {
    case GET_MILITARY_SERVICE_PDF:
      return { ...state, loading: true };
    case GET_MILITARY_SERVICE_PDF_SUCCESS:
      return {
        ...state,
        loading: false,
        successfulDownload: true,
        failedDownload: false,
        error: false,
      };
    case GET_MILITARY_SERVICE_PDF_FAILED:
      return {
        ...state,
        loading: false,
        successfulDownload: false,
        failedDownload: true,
        error,
      };
    default:
      return state;
  }
};

export default militaryServicePdfReducer;
