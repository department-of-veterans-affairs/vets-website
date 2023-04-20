import React from 'react';
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
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
          Identify the person whose records you are authorizing the release of
        </h3>
      ),
      [patientIdentificationFields.patientFullName]: fullNameUI,
      [patientIdentificationFields.patientSsn]: {
        ...ssnUI,
        'ui:required': () => true,
      },
      [patientIdentificationFields.patientVaFileNumber]: {
        'ui:title': 'VA file number (if applicable)',
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
