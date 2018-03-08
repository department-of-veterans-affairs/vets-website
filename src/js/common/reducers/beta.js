import {
  FETCH_BETA_FEATURES_SUCCESS,
  BETA_REGISTER_SUCCESS,
  BETA_REGISTER_FAILURE,
  BETA_REGISTERING,
  statuses
} from '../actions';

function sessionStorageInit() {
  let initialState = [];
  if (sessionStorage.betaFeatures) {
    initialState = JSON.parse(sessionStorage.betaFeatures);
  }
  return initialState;
}

function sessionStorageWrapper(reducer) {
  return (state, action) => {
    const newState = reducer(state, action);
    sessionStorage.betaFeatures = JSON.stringify(newState);
    return newState;
  };
}

function betaFeatures(state = sessionStorageInit(), action) {
  switch (action.type) {
    case FETCH_BETA_FEATURES_SUCCESS:
      return action.betaFeatures;

    case BETA_REGISTERING: {
      const feature = { feature: action.featureName, status: statuses.pending };
      return state.concat(feature);
    }

    case BETA_REGISTER_FAILURE:
    case BETA_REGISTER_SUCCESS: {
      const feature = { feature: action.featureName, status: action.status };
      return state.map(b => {
        return b.feature === action.featureName ? feature : b;
      });
    }

    default:
      return state;
  }
}

export default sessionStorageWrapper(betaFeatures);
