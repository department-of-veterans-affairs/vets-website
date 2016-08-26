import _ from 'lodash/fp';

import { VETERAN_FIELD_UPDATE, ENSURE_FIELDS_INITIALIZED } from '../../actions';
import { makeField } from '../../../common/model/fields';

const blankVeteran = {
  benefitsChosen: makeField(''),
  chapter30Relinquished: false,
  chapter1606Relinquished: false,
  chapter1607Relinquished: false,
  nothingToRelinquish: false,
};

export default function veteran(state = blankVeteran, action) {
  switch (action.type) {
    case VETERAN_FIELD_UPDATE: {
      return _.set(action.propertyPath, action.value, state);
    }
    case ENSURE_FIELDS_INITIALIZED: {
      return action.fields.reduce((vet, field) => {
        return _.set([field, 'dirty'], true, vet);
      }, state);
    }
    default:
      return state;
  }
}
