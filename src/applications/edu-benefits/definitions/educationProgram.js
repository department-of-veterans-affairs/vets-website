import merge from 'lodash/merge';
import set from 'platform/utilities/data/set';

import { showSchoolAddress } from '../utils/helpers';
import * as address from 'platform/forms/definitions/address';
import educationTypeUISchema from './educationType';

export const uiSchema = {
  'ui:order': ['name', 'educationType', 'address'],
  address: merge({}, address.uiSchema(), {
    'ui:options': {
      expandUnder: 'educationType',
      expandUnderCondition: showSchoolAddress,
    },
  }),
  educationType: educationTypeUISchema,
  name: {
    'ui:title': 'Name of school, university, or training facility',
  },
};

// including this because it has an address and we need to override that with the FE schema
// we also may need to add required attributes
export function schema(localSchema, required = []) {
  const withRequiredSchema = set(
    'required',
    required,
    localSchema.definitions.educationProgram,
  );
  return set(
    'properties.address',
    address.schema(localSchema),
    withRequiredSchema,
  );
}
