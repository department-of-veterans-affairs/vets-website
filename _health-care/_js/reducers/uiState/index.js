import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { ENSURE_FIELDS_INITIALIZED, VETERAN_FIELD_UPDATE } from '../../actions';
import { initializeNullValues } from '../../utils/validations';
import { pathToData } from '../../store';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);


const ui = {
  completedSections: {
    introduction: true,
    nameAndGeneralInformation: false,
    vaInformation: false,
    additionalInformation: false,
    demographicInformation: false,
    veteranAddress: false,
    financialDisclosure: false,
    spouseInformation: false,
    childInformation: false,
    annualIncome: false,
    deductibleExpenses: false,
    insuranceInformation: false,
    medicareMedicaid: false,
    serviceInformation: false,
    militaryAdditionalInfo: false
  }
};

function uiState(state = ui, action) {
  let newState = undefined;
  switch (action.type) {
    case VETERAN_FIELD_UPDATE:
      newState = Object.assign({}, state);
      _.set(newState, action.propertyPath, action.value);
      return newState;

    case ENSURE_FIELDS_INITIALIZED:
      newState = Object.assign({}, state);
      // TODO(awong): HACK! Assigning to the sub object assumes pathToData() returns a reference
      // to the actual substructre such that it can be reassigned to.
      Object.assign(pathToData(newState, action.path), initializeNullValues(pathToData(newState, action.path)));
      return newState;

    default:
      return state;
  }
}

export default uiState;
