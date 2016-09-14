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
        const filteredFields = action.fields.filter(field => state[action.parentNode][field] !== undefined);
        const updatedParentArray = _.get(action.parentNode, state).map(item => {
          return filteredFields.reduce((itemState, field) => {
            return _.set(field, dirtyAllFields(item[field]), itemState);
          }, item);
        }, state[action.parentNode]);

        newState = _.set(action.parentNode, updatedParentArray, state);
      } else {
        const filteredFields = action.fields.filter(field => state[field] !== undefined);
        newState = filteredFields.reduce((vet, field) => {
          return _.set(field, dirtyAllFields(state[field]), vet);
        }, state);
      }
      return newState;
    }
    default:
      return state;
  }
}
