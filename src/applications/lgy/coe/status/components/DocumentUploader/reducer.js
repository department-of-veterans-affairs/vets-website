import { ACTIONS } from '../../../shared/constants';
import { DOCUMENT_TYPES } from '../../constants';

export const initialState = {
  documentType: DOCUMENT_TYPES[0],
  documentDescription: {
    dirty: false,
    value: '',
  },
  errorMessage: null,
  files: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.DOC_TYPE:
      return { ...state, documentType: action.documentType };
    case ACTIONS.DOC_DESC:
      return { ...state, documentDescription: action.documentDescription };
    case ACTIONS.FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        files: [...state.files, action.file],
        errorMessage: null,
      };
    case ACTIONS.FILE_UPLOAD_PENDING:
      return { ...state, errorMessage: null };
    case ACTIONS.FORM_SUBMIT_FAIL:
    case ACTIONS.FILE_UPLOAD_FAIL:
      return {
        ...state,
        files: [],
        errorMessage: action.errorMessage,
        submissionPending: false,
      };
    case ACTIONS.FORM_SUBMIT_PENDING:
      return {
        ...state,
        submissionPending: true,
      };
    case ACTIONS.FORM_SUBMIT_SUCCESS:
      return {
        ...state,
        files: [],
        documentType: null,
        errorMessage: null,
        successMessage: true,
        submissionPending: false,
      };
    case ACTIONS.DELETE_FILE:
      return { ...state, files: action.files };
    default:
      return state;
  }
};
