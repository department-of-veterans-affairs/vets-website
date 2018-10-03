import vet360 from '../vet360/reducers';

import {
  FETCH_HERO_SUCCESS,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_SUCCESS,
} from '../actions';

const initialState = {
  hero: null,
  personalInformation: null,
  militaryInformation: null,
};

function vaProfile(state = initialState, action) {
  switch (action.type) {
    case FETCH_HERO_SUCCESS:
      return { ...state, hero: action.hero };

    case FETCH_PERSONAL_INFORMATION_SUCCESS:
      return { ...state, personalInformation: action.personalInformation };

    case FETCH_MILITARY_INFORMATION_SUCCESS:
      return { ...state, militaryInformation: action.militaryInformation };

    default:
      return state;
  }
}

export default {
  vaProfile,
  vet360,
};
