// import set from 'platform/utilities/data/set';
import {
  UPDATE_LOCATION_STATE,
  RESET_LOCATION_STATE,
} from '../../actions/custom-location';

const initialState = {
  form: {
    data: {
      currentMarriageInformation: {
        location: {
          state: undefined,
        },
      },
    },
  },
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOCATION_STATE:
      // console.log({ action, state });
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data,
            currentMarriageInformation: {
              ...state.form.data.currentMarriageInformation,
              location: {
                ...state.form.data.currentMarriageInformation.location,
                state: action.payload,
              },
            },
          },
        },
      };
    case RESET_LOCATION_STATE:
      return {
        ...state,
        form: {
          ...state.form,
          data: {
            ...state.form.data,
            currentMarriageInformation: {
              ...state.form.data.currentMarriageInformation,
              location: {
                ...state.form.data.currentMarriageInformation.location,
                state: undefined,
              },
            },
          },
        },
      };
    default:
      return state;
  }
};

export default locationReducer;
