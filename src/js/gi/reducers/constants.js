import { FETCH_CONSTANTS_STARTED, FETCH_CONSTANTS_FAILED, FETCH_CONSTANTS_SUCCEEDED } from '../actions';

const INITIAL_STATE = {
  inProgress: false,
  version: {}
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CONSTANTS_STARTED:
      return {
        ...state,
        inProgress: true
      };
    case FETCH_CONSTANTS_FAILED:
      return {
        ...state,
        ...action.err,
        inProgress: false
      };
    case FETCH_CONSTANTS_SUCCEEDED:
      const constants = action.payload.data.reduce((constants, c) => {
        const { name, value } = c.attributes;
        return { ...constants, [name]: value };
      }, {});
      return {
        ...state,
        constants,
        version: action.payload.meta.version,
        inProgress: false,
      };
    default:
      return state;
  }
}
