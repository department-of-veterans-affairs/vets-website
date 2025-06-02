import { intersection, pick } from 'lodash';

import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { preparerIdentificationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  preparerIdentificationFields.parentObject
];
const pageFields = [preparerIdentificationFields.preparerAddress];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [preparerIdentificationFields.parentObject]: {
      [preparerIdentificationFields.preparerAddress]: {
        ...address.uiSchema(
          '',
          false,
          null,
          formData =>
            formData[preparerIdentificationFields.parentObject][
              preparerIdentificationFields.preparerHasSameAddressAsVeteran
            ],
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [preparerIdentificationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: {
          ...pick(properties, pageFields),
          [preparerIdentificationFields.preparerAddress]: address.schema(
            fullSchema,
            formData =>
              formData[preparerIdentificationFields.parentObject][
                preparerIdentificationFields.preparerHasSameAddressAsVeteran
              ],
          ),
        },
      },
    },
  },
};
