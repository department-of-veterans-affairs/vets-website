import { intersection, pick } from 'lodash';

import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { livingSituationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  livingSituationFields.parentObject
];
const pageFields = [
  livingSituationFields.careFacilityName,
  livingSituationFields.careFacilityAddress,
];

export default {
  uiSchema: {
    [livingSituationFields.parentObject]: {
      'ui:title': 'Details about your current living situation',
      [livingSituationFields.careFacilityName]: {
        'ui:title':
          'What is the name of the nursing home or medical care facility?',
      },
      [livingSituationFields.careFacilityAddress]: address.uiSchema(
        'What is the address of the nursing home or medical care facility you are living in?',
        false,
        formData =>
          formData[livingSituationFields.parentObject][
            livingSituationFields.isInCareFacility
          ],
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [livingSituationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: {
          ...pick(properties, pageFields),
          // address definitions appear to be implemented differently
          [livingSituationFields.careFacilityAddress]: address.schema(
            fullSchema,
            formData =>
              formData[livingSituationFields.parentObject][
                livingSituationFields.isInCareFacility
              ],
          ),
        },
      },
    },
  },
};
