import { omit } from 'lodash';
import {
  FETCH_FORM_PDF_URL_STARTED,
  FETCH_FORM_PDF_URL_SUCCEEDED,
  FETCH_FORM_PDF_URL_FAILED,
} from '../actions/form-pdf-url';
import { FETCH_FORM_STATUS_STARTED } from '../actions/form-status';

const initialState = {
  loading: false,
  submissions: {},
};

const formPdfUrlsReducer = (state = initialState, action) => {
  const { loading, submissions } = state;
  const { type, guid, url, error } = action;
  switch (type) {
    case FETCH_FORM_PDF_URL_STARTED:
      return { loading: true, submissions: omit(submissions, guid) };
    case FETCH_FORM_PDF_URL_SUCCEEDED:
      return {
        loading: false,
        submissions: { ...submissions, [guid]: { url } },
      };
    case FETCH_FORM_PDF_URL_FAILED:
      return {
        loading: false,
        submissions: { ...submissions, [guid]: { error } },
      };
    case FETCH_FORM_STATUS_STARTED:
      return { loading, submissions: {} };
    default:
      return state;
  }
};

export default formPdfUrlsReducer;
