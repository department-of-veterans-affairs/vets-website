import {
  CH31_PDF_LETTER_DOWNLOAD_STARTED,
  CH31_PDF_LETTER_DOWNLOAD_SUCCEEDED,
  CH31_PDF_LETTER_DOWNLOAD_FAILED,
  CH31_PDF_LETTER_DOWNLOAD_ERROR_400_BAD_REQUEST,
  CH31_PDF_LETTER_DOWNLOAD_ERROR_403_FORBIDDEN,
  CH31_PDF_LETTER_DOWNLOAD_ERROR_503_UNAVAILABLE,
  CH31_PDF_LETTER_DOWNLOAD_ERROR_500_SERVER,
} from '../constants';

const initialState = {
  loading: false,
  error: null,
  data: null,
};

export default function ch31PdfLetterDownload(state = initialState, action) {
  switch (action.type) {
    case CH31_PDF_LETTER_DOWNLOAD_STARTED:
      return { ...state, loading: true, error: null };

    case CH31_PDF_LETTER_DOWNLOAD_SUCCEEDED:
      return { ...state, loading: false, data: action.payload, error: null };

    case CH31_PDF_LETTER_DOWNLOAD_ERROR_400_BAD_REQUEST:
    case CH31_PDF_LETTER_DOWNLOAD_ERROR_403_FORBIDDEN:
    case CH31_PDF_LETTER_DOWNLOAD_ERROR_503_UNAVAILABLE:
    case CH31_PDF_LETTER_DOWNLOAD_ERROR_500_SERVER:
    case CH31_PDF_LETTER_DOWNLOAD_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error || { status: null, messages: ['Unknown error'] },
      };

    default:
      return state;
  }
}
