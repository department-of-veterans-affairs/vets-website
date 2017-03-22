import _ from 'lodash/fp';

import { showSchoolAddress } from '../utils/helpers';
import * as address from '../../common/schemaform/definitions/address';
import educationTypeUISchema from '../definitions/educationType';

export const uiSchema = {
  'ui:order': ['name', 'educationType', 'address'],
  address: _.merge(address.uiSchema(), {
    'ui:options': {
      hideIf: (formData) => !showSchoolAddress(_.get('educationProgram.educationType', formData))
    }
  }),
  educationType: educationTypeUISchema,
  name: {
    'ui:title': 'Name of school, university, or training facility'
  }
};

// including this because it has an address and we need to override that with the FE schema
// we also may need to add required attributes
export function schema(localSchema, required = []) {
  const withRequiredSchema = _.set('required', required, localSchema.definitions.educationProgram);
  return _.set('properties.address', address.schema(), withRequiredSchema);
}
