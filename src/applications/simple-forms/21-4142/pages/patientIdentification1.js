import React from 'react';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { intersection, pick } from 'lodash';
import environment from 'platform/utilities/environment';
import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { patientIdentificationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  patientIdentificationFields.parentObject
];
const pageFields = [patientIdentificationFields.isRequestingOwnMedicalRecords];

/** @type {PageSchema} */
export default {
  uiSchema: environment.isProduction()
    ? {
        [patientIdentificationFields.parentObject]: {
          'ui:title': (
            <h3 className="vads-u-color--gray-dark vads-u-margin-top--0 vads-u-margin-bottom--3">
              Records identification
            </h3>
          ),
          [patientIdentificationFields.isRequestingOwnMedicalRecords]: {
            'ui:title':
              'Whose medical records or information are you authorizing the release of?',
            'ui:widget': 'yesNo',
            'ui:options': {
              labels: {
                Y: 'The Veteran',
                N: 'Someone else connected to the Veteran',
              },
            },
          },
        },
      }
    : {
        [patientIdentificationFields.parentObject]: {
          ...titleUI({
            title: 'Records identification',
          }),
          [patientIdentificationFields.isRequestingOwnMedicalRecords]: yesNoUI({
            title: 'Whose medical records are you authorizing the release of?',
            labels: {
              Y: "The Veteran's",
              N: 'Someone else connected to the Veteran',
            },
            errorMessages: {
              required:
                "Select whose medical records you're authorizing the release of.",
            },
          }),
        },
      },
  schema: {
    type: 'object',
    properties: environment.isProduction()
      ? {
          [patientIdentificationFields.parentObject]: {
            type: 'object',
            required: intersection(required, pageFields),
            properties: pick(properties, pageFields),
          },
        }
      : {
          [patientIdentificationFields.parentObject]: {
            type: 'object',
            required: [
              patientIdentificationFields.isRequestingOwnMedicalRecords,
            ],
            properties: {
              [patientIdentificationFields.isRequestingOwnMedicalRecords]: yesNoSchema,
            },
          },
        },
  },
};
