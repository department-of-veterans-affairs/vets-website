import {
  FILTERS_CHANGED,
  UPDATE_QUERY_PARAMS,
  SEARCH_STARTED,
} from '../actions';
import { FILTERS_EXCLUDED_FLIP } from '../selectors/filters';
import environment from 'platform/utilities/environment';

export const INITIAL_STATE = Object.freeze({
  expanded: false,
  search: false,
  schools: true,
  excludedSchoolTypes: [
    'PUBLIC',
    'FOR PROFIT',
    'PRIVATE',
    'FOREIGN',
    'FLIGHT',
    'CORRESPONDENCE',
  ],
  excludeCautionFlags: false,
  accredited: false,
  studentVeteran: false,
  yellowRibbonScholarship: false,
  specialMission: 'ALL',
  employers: true,
  vettec: true,
  preferredProvider: false,
  country: 'ALL',
  state: 'ALL',
});

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FILTERS_CHANGED:
      return {
        ...state,
        ...action.payload,
      };

    case UPDATE_QUERY_PARAMS: {
      const queryParams = action.payload;
      let environmentBasedLoadState;
      if (environment.isProduction())
        environmentBasedLoadState = { excludedSchoolTypes: [] };
      else
        environmentBasedLoadState = {
          excludedSchoolTypes: [
            'PUBLIC',
            'FOR PROFIT',
            'PRIVATE',
            'FOREIGN',
            'FLIGHT',
            'CORRESPONDENCE',
          ],
        };
      const onLoadState = environmentBasedLoadState;

      Object.keys(INITIAL_STATE).forEach(key => {
        let value = queryParams[key];

        if (FILTERS_EXCLUDED_FLIP.includes(key)) {
          value = Object.keys(queryParams).includes(
            `exclude${key[0].toUpperCase() + key.slice(1).toLowerCase()}`,
          )
            ? false
            : undefined;
        }

        if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        }

        if (value !== undefined) {
          onLoadState[key] = value;
        }
      });
      onLoadState.expanded = Object.entries(onLoadState).length > 0;

      return { ...state, ...onLoadState };
    }

    case SEARCH_STARTED:
      return { ...state, search: false };

    default:
      return { ...state };
  }
}
