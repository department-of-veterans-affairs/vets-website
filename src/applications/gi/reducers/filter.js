import { INSTITUTION_FILTER_CHANGED } from '../actions';
import environment from 'platform/utilities/environment';

const INITIAL_STATE = {
  category: environment.isProduction() ? 'ALL' : 'school',
  type: 'ALL',
  country: 'ALL',
  state: 'ALL',
  studentVeteranGroup: false,
  yellowRibbonScholarship: false,
  principlesOfExcellence: false,
  eightKeysToVeteranSuccess: false,
  stemOffered: false,
  typeName: 'ALL',
  // eslint-disable-next-line camelcase
  vet_tec_provider: false,
  providers: [],
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INSTITUTION_FILTER_CHANGED:
      return {
        ...INITIAL_STATE,
        ...action.filter,
      };
    default:
      return { ...state };
  }
}
