import { intersection, pick } from 'lodash';

import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import environment from 'platform/utilities/environment';
import {
  titleUI,
  addressNoMilitarySchema,
  addressNoMilitaryUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { preparerIdentificationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  preparerIdentificationFields.parentObject
];
const pageFields = [preparerIdentificationFields.preparerAddress];

/** @type {PageSchema} */
export default {
  uiSchema: environment.isProduction()
    ? {
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
      }
    : {
        [preparerIdentificationFields.parentObject]: {
          ...titleUI('Mailing address'),
          [preparerIdentificationFields.preparerAddress]: addressNoMilitaryUI({
            omit: ['street3'],
          }),
        },
      },
  schema: {
    type: 'object',
    properties: environment.isProduction()
      ? {
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
        }
      : {
          [preparerIdentificationFields.parentObject]: {
            type: 'object',
            properties: {
              [preparerIdentificationFields.preparerAddress]: addressNoMilitarySchema(
                {
                  omit: ['street3'],
                },
              ),
            },
          },
        },
  },
};
