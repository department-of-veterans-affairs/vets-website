import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { UPDATE_COMPLETION_STATUS, UPDATE_REVIEW_STATUS } from '../../actions';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);


const ui = {
  completedSections: {
    '/introduction': false,
    '/personal-information/name-and-general-information': false,
    '/personal-information/va-information': false,
    '/personal-information/additional-information': false,
    '/personal-information/demographic-information': false,
    '/personal-information/veteran-address': false,
    '/insurance-information/general': false,
    '/insurance-information/medicare-medicaid': false,
    '/military-service/service-information': false,
    '/military-service/additional-information': false,
    '/financial-assessment/financial-disclosure': false,
    '/financial-assessment/spouse-information': false,
    '/financial-assessment/child-information': false,
    '/financial-assessment/annual-income': false,
    '/financial-assessment/deductible-expenses': false,
    '/review-and-submit': false
  }
};

function uiState(state = ui, action) {
  let newState = undefined;
  switch (action.type) {
    case UPDATE_COMPLETION_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.completedSections, action.path, true);
      return newState;

    case UPDATE_REVIEW_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.completedSections, action.path, action.value);
      return newState;

    default:
      return state;
  }
}

export default uiState;
