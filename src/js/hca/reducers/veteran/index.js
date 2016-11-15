import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { ENSURE_FIELDS_INITIALIZED, VETERAN_FIELD_UPDATE, VETERAN_OVERWRITE, UPDATE_SPOUSE_ADDRESS } from '../../actions';
import { makeField, dirtyAllFields } from '../../../common/fields';
import { blankVeteran } from '../../../common/veteran';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);

export default function veteran(state = blankVeteran, action) {
  let newState = undefined;
  switch (action.type) {
    case VETERAN_FIELD_UPDATE: {
      newState = Object.assign({}, state);
      _.set(newState, action.propertyPath, action.value);
      return newState;
    }

    case ENSURE_FIELDS_INITIALIZED: {
      newState = Object.assign({}, state);

      if (action.parentNode) {
        action.fields.map((field) => {
          Object.assign(newState[action.parentNode][0][field], dirtyAllFields(newState[action.parentNode][0][field]));
          return newState;
        });
      } else {
        action.fields.map((field) => {
          Object.assign(newState[field], dirtyAllFields(newState[field]));
          return newState;
        });
      }

      return newState;
    }

    case VETERAN_OVERWRITE:
      return action.value;

    // Copies the veteran's address into the spouse's address fields if they have the same address.
    // Clears the spouse's address fields if they do not.
    case UPDATE_SPOUSE_ADDRESS: {
      newState = Object.assign({}, state);
      const emptyAddress = {
        street: makeField(''),
        street2: makeField(''),
        street3: makeField(''),
        city: makeField(''),
        country: makeField(''),
        state: makeField(''),
        provinceCode: makeField(''),
        zipcode: makeField(''),
        postalCode: makeField('')
      };
      if (action.value.value === 'Y') {
        _.set(newState, action.propertyPath, state.veteranAddress);
      } else {
        _.set(newState, action.propertyPath, emptyAddress);
      }
      return newState;
    }

    default:
      return state;
  }
}
