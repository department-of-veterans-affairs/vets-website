import React from 'react';
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
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-top--0 vads-u-margin-bottom--3">
          Records identification
        </h3>
      ),
      [patientIdentificationFields.isRequestingOwnMedicalRecords]: {
        'ui:title': 'Are you authoring the release your own medical records?',
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
