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
        const updatedParentArray = state[action.parentNode].map(item => {
          return action.fields.reduce((itemState, field) => {
            return _.set(field, dirtyAllFields(item[field]), itemState);
          }, item);
        }, state[action.parentNode]);

        newState = _.set(action.parentNode, updatedParentArray, state);
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
