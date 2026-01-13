import set from 'platform/utilities/data/set';

import { PERSONAL_INFO_FIELD_NAMES } from '@@vap-svc/constants';

import { capitalize } from 'lodash';
import {
  UPDATE_PERSONAL_INFORMATION_FIELD,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
} from '@@vap-svc/actions/personalInformation';
import {
  UPDATE_SCHEDULING_PREFERENCES_FIELD,
  FETCH_SCHEDULING_PREFERENCES,
  FETCH_SCHEDULING_PREFERENCES_FAILED,
  FETCH_SCHEDULING_PREFERENCES_SUCCESS,
} from '@@vap-svc/actions/schedulingPreferences';
import {
  convertSchedulingPreferenceToReduxFormat,
  convertSchedulingPreferencesToReduxFormat,
} from '@@vap-svc/util/health-care-settings/schedulingPreferencesUtils';
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
      return set('powerOfAttorney', action.poa, state);

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

    case FETCH_SCHEDULING_PREFERENCES:
      return set(
        'schedulingPreferences',
        { error: false, loading: true },
        state,
      );

    case FETCH_SCHEDULING_PREFERENCES_SUCCESS:
      return set(
        'schedulingPreferences',
        {
          ...convertSchedulingPreferencesToReduxFormat(
            action.schedulingPreferences,
          ),
          loading: false,
        },
        state,
      );
    case FETCH_SCHEDULING_PREFERENCES_FAILED:
      return set(
        'schedulingPreferences',
        {
          error: true,
          loading: false,
        },
        state,
      );

    case UPDATE_SCHEDULING_PREFERENCES_FIELD: {
      return set(
        `schedulingPreferences.${action.fieldName}`,
        convertSchedulingPreferenceToReduxFormat(
          action.value[action.fieldName],
          action.fieldName,
        ),
        state,
      );
    }

    case FETCH_MILITARY_INFORMATION_SUCCESS:
    case FETCH_MILITARY_INFORMATION_FAILED:
      return set('militaryInformation', action.militaryInformation, state);

    default:
      return state;
  }
}

export default vaProfile;
