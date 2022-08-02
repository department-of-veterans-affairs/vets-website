import {
  FETCH_STATIC_DATA_STARTED,
  FETCH_STATIC_DATA_SUCCEEDED,
} from '../actions';

const initialState = {};

export default function drupalStaticData(state = initialState, action) {
  switch (action.type) {
    case FETCH_STATIC_DATA_STARTED:
      return {
        ...state,
        [action.payload.statePropName]: {
          loading: true,
          data: action?.payload?.data || {},
        },
      };
    case FETCH_STATIC_DATA_SUCCEEDED:
      return {
        ...state,
        [action.payload.statePropName]: {
          loading: false,
          data: action.payload.data,
        },
      };
    default:
      return state;
  }
}
