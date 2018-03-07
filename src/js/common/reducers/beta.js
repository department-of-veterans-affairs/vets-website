import {
  FETCH_BETA_FEATURES_SUCCESS,
  BETA_REGISTER_SUCCESS,
  BETA_REGISTER_FAILURE,
  BETA_REGISTERING
} from '../actions';

const initialState = [];

export default function betaFeatures(state = initialState, action) {
  switch (action.type) {
    case FETCH_BETA_FEATURES_SUCCESS:
      return action.betaFeatures;

    case BETA_REGISTERING: {
      const feature = { feature: action.featureName, isLoading: true };
      return state.betaFeatures.concat(feature);
    }

    case BETA_REGISTER_FAILURE:
    case BETA_REGISTER_SUCCESS: {
      const feature = { feature: action.featureName, status: action.status, isLoading: false };
      return state.betaFeatures.map(b => {
        return b.feature === action.featureName ? feature : b;
      });
    }

    default:
      return state;
  }
}
