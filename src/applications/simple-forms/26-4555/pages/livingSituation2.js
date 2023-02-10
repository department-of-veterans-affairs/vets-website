import { intersection, pick } from 'lodash';

import * as address from 'platform/forms-system/src/js/definitions/address';
import { livingSituationFields } from '../definitions/constants';
import fullSchema from '../26-4555-schema.json';

const { required, properties } = fullSchema.properties[
  livingSituationFields.parentObject
];
const pageFields = [
  livingSituationFields.careFacilityName,
  livingSituationFields.careFacilityAddress,
];

const livingSituation2 = {
  uiSchema: {
    [livingSituationFields.careFacilityName]: {
      'ui:title':
        'What is the name of the nursing home or medical care facility?',
    },
    // can't use ('...', true) here to turn on line 3
    // check if usAddress or profileAddress definitions works better for that
    [livingSituationFields.careFacilityAddress]: address.uiSchema(
      'What is the address of the nursing home or medical care facility you are living in?',
      false,
      formData => formData.isInCareFacility,
    ),
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    properties: {
      ...pick(properties, pageFields),
      // address definitions appear to be implemented differently
      [livingSituationFields.careFacilityAddress]: address.schema(
        fullSchema,
        true,
      ),
    },
  },
};

export default livingSituation2;
