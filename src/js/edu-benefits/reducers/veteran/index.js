import _ from 'lodash/fp';

import { VETERAN_FIELD_UPDATE, ENSURE_FIELDS_INITIALIZED } from '../../actions';
import { createVeteran } from '../../utils/veteran';
import { dirtyAllFields } from '../../../common/model/fields';

const blankVeteran = createVeteran();

export default function veteran(state = blankVeteran, action) {
  switch (action.type) {
    case VETERAN_FIELD_UPDATE: {
      return _.set(action.propertyPath, action.value, state);
    }
    case ENSURE_FIELDS_INITIALIZED: {
      let newState;
      if (action.parentNode) {
        newState = action.fields.reduce((currentState, field) => {
          return _.set([action.parentNode, 0, field], dirtyAllFields(currentState[action.parentNode][0][field]), currentState);
        }, state);
      } else {
        newState = action.fields.reduce((vet, field) => {
          return _.isObject(vet[field]) ?
            _.set([field, 'dirty'], true, vet) :
            vet;
        }, state);
      }
      return newState;
    }
    default:
      return state;
  }
}
