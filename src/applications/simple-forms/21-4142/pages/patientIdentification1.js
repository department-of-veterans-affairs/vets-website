import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { intersection, pick } from 'lodash';
import { patientIdentificationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  patientIdentificationFields.parentObject
];
const pageFields = [patientIdentificationFields.isRequestingOwnMedicalRecords];

export default {
  uiSchema: {
    [patientIdentificationFields.parentObject]: {
      [patientIdentificationFields.isRequestingOwnMedicalRecords]: {
        'ui:title': 'Are you requesting your own medical records?',
        'ui:widget': 'yesNo',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [patientIdentificationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
