import _ from 'lodash';

import { ENSURE_FIELDS_INITIALIZED, VETERAN_FIELD_UPDATE } from '../../actions';
import { makeField, dirtyAllFields } from '../../../common/model/fields';

const blankVeteran = {
  chapter33: makeField(false),
  chapter30: makeField(false),
  chapter1606: makeField(false),
  chapter32: makeField(false)
};

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
    default:
      return state;
  }
}
