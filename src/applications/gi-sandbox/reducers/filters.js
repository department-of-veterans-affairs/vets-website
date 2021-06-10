import { FILTERS_CHANGED, UPDATE_QUERY_PARAMS } from '../actions';
import { FILTERS_EXCLUDED_FLIP } from '../constants';

const INITIAL_STATE = Object.freeze({
  expanded: false,
  accredited: false,
  excludeCautionFlags: false,
  country: 'ALL',
  employers: true,
  hbcu: false,
  isRelaffil: false,
  preferredProvider: false,
  schools: true,
  singleGenderSchool: false,
  state: 'ALL',
  studentVeteranGroup: false,
  type: 'ALL',
  yellowRibbonScholarship: false,
  vettec: true,
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
      const onLoadState = {};
      Object.keys(INITIAL_STATE).forEach(key => {
        let paramKey = key;
        if (FILTERS_EXCLUDED_FLIP.includes(key)) {
          paramKey = `exclude_${key}`;
        }

        let value = queryParams[paramKey];
        if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        }

        if (queryParams[paramKey] !== undefined) {
          onLoadState[key] = value;
        }
      });
      onLoadState.expanded = Object.entries(onLoadState).length > 0;

      return { ...state, ...onLoadState };
    }

    default:
      return { ...state };
  }
}
