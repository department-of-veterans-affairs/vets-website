import set from 'platform/utilities/data/set';

import { PERSONAL_INFO_FIELD_NAMES } from '@@vap-svc/constants';

import { capitalize } from 'lodash';
import {
  UPDATE_PERSONAL_INFORMATION_FIELD,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
} from '@@vap-svc/actions/personalInformation';
import {
  FETCH_HERO_SUCCESS,
  FETCH_HERO_FAILED,
  FETCH_MILITARY_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_FAILED,
  FETCH_POWER_OF_ATTORNEY_SUCCESS,
  FETCH_POWER_OF_ATTORNEY_FAILED,
} from '../actions';

const initialState = {
  hero: null,
  personalInformation: null,
  militaryInformation: null,
  powerOfAttorney: null,
};

function vaProfile(state = initialState, action) {
  switch (action.type) {
    case FETCH_HERO_SUCCESS:
    case FETCH_HERO_FAILED:
      return set('hero', action.hero, state);

    case FETCH_PERSONAL_INFORMATION_SUCCESS:
    case FETCH_PERSONAL_INFORMATION_FAILED:
      return set('personalInformation', action.personalInformation, state);

    case FETCH_POWER_OF_ATTORNEY_SUCCESS:
    case FETCH_POWER_OF_ATTORNEY_FAILED:
      return set('powerOfAttorney', action.powerOfAttorney, state);

    case UPDATE_PERSONAL_INFORMATION_FIELD: {
      let fieldValue;
      switch (action.fieldName) {
        case PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME: {
          fieldValue = capitalize(action.value[action.fieldName]);
          break;
        }
        case PERSONAL_INFO_FIELD_NAMES.GENDER_IDENTITY: {
          fieldValue = { code: action.value[action.fieldName] };
          break;
        }
        default:
          fieldValue = action.value[action.fieldName];
          break;
      }

      return set(`personalInformation.${action.fieldName}`, fieldValue, state);
    }

    case FETCH_MILITARY_INFORMATION_SUCCESS:
    case FETCH_MILITARY_INFORMATION_FAILED:
      return set('militaryInformation', action.militaryInformation, state);

    default:
      return state;
  }
}

export default vaProfile;
