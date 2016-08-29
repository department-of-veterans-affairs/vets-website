import _ from 'lodash/fp';

import { VETERAN_FIELD_UPDATE, ENSURE_FIELDS_INITIALIZED } from '../../actions';
import { makeField } from '../../../common/model/fields';

const blankVeteran = {
  benefitsRelinquished: makeField(''),
  chapter30: false,
  chapter1606: false,
  chapter32: false,
  chapter33: false
};

export default function veteran(state = blankVeteran, action) {
  switch (action.type) {
    case VETERAN_FIELD_UPDATE: {
      return _.set(action.propertyPath, action.value, state);
    }
    case ENSURE_FIELDS_INITIALIZED: {
      return action.fields.reduce((vet, field) => {
        return _.isObject(vet[field]) ?
          _.set([field, 'dirty'], true, vet) :
          vet;
      }, state);
    }
    default:
      return state;
  }
}
