import { SET_UPLOADING, DONE_UPLOADING, SET_UPLOADER } from '../actions/types';

const initialState = {
  confirmationCode: null,
  uploading: false,
  uploadComplete: false,
  uploadError: false,
  uploader: null,
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_UPLOADING: {
      return {
        ...state,
        uploading: action.uploading,
        uploadError: false,
        uploadComplete: false,
        uploader: action.uploader,
      };
    }
    case SET_UPLOADER: {
      return {
        ...state,
        uploader: action.uploader,
      };
    }
    case DONE_UPLOADING: {
      return {
        ...state,
        uploading: false,
        uploadComplete: true,
        uploader: null,
        confirmationCode: action.confirmationCode,
      };
    }
    default:
      return state;
  }
}
