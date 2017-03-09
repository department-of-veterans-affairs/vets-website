import _ from 'lodash/fp';

import definitions from 'vets-json-schema/dist/definitions.json';

import { showSchoolAddress } from '../utils/helpers';
import * as address from '../../common/schemaform/definitions/address';
import educationTypeUISchema from '../definitions/educationType';

export const uiSchema = {
  'ui:order': ['name', 'educationType', 'address'],
  address: address.uiSchema(),
  educationType: educationTypeUISchema,
  name: {
    'ui:title': 'Name of school, university, or training facility'
  },
  'ui:options': {
    updateSchema: (program, form, programSchema) => {
      const showAddress = showSchoolAddress(_.get('educationType', program));

      if (!showAddress && !programSchema.properties.address['ui:hidden']) {
        return {
          properties: _.set(['address', 'ui:hidden'], true, programSchema.properties)
        };
      } else if (showAddress && !!programSchema.properties.address['ui:hidden']) {
        return {
          properties: _.unset(['address', 'ui:hidden'], programSchema.properties)
        };
      }

      return {};
    }
  }
};

// including this because it has an address and we need to override that with the FE schema
// we also may need to add required attributes
export function schema(required = []) {
  const withRequiredSchema = _.set('required', required, definitions.educationProgram);
  return _.set('properties.address', address.schema(), withRequiredSchema);
}
