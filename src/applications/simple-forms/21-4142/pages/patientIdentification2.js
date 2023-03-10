import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { intersection, pick } from 'lodash';
import { patientIdentificationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  patientIdentificationFields.parentObject
];
const pageFields = [
  patientIdentificationFields.patientFullName,
  patientIdentificationFields.patientSsn,
  patientIdentificationFields.patientVaFileNumber,
];

export default {
  uiSchema: {
    [patientIdentificationFields.parentObject]: {
      // 'ui:title': 'Whose records are you granting authorization to release?',
      [patientIdentificationFields.patientFullName]: {
        first: {
          ...fullNameUI.first,
          'ui:title': "Patient's first name",
        },
        middle: {
          ...fullNameUI.middle,
          'ui:title': "Patient's middle name",
        },
        last: {
          ...fullNameUI.last,
          'ui:title': "Patient's last name",
        },
      },
      [patientIdentificationFields.patientSsn]: {
        ...ssnUI,
        'ui:required': () => true,
        'ui:title': "Patient's social security number",
      },
      [patientIdentificationFields.patientVaFileNumber]: {
        'ui:title': "Patient's VA file number",
        'ui:errorMessages': {
          pattern:
            'Please input a valid VA file number: 7 to 9 numeric digits, & may start with a letter "C" or "c".',
        },
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
