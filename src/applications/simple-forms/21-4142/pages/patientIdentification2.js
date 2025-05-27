import React from 'react';
import ssnDeprecatedUI from 'platform/forms-system/src/js/definitions/ssn';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { intersection, pick } from 'lodash';
import environment from 'platform/utilities/environment';
import {
  titleUI,
  fullNameUI,
  vaFileNumberUI,
  ssnUI,
  fullNameSchema,
  ssnSchema,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fullNameDeprecatedUI } from '../../shared/definitions/rjsfPatterns';
import { patientIdentificationFields } from '../definitions/constants';
import { getFullNameLabels } from '../helpers';

const { required, properties } = fullSchema.properties[
  patientIdentificationFields.parentObject
];
const pageFields = [
  patientIdentificationFields.patientFullName,
  patientIdentificationFields.patientSsn,
  patientIdentificationFields.patientVaFileNumber,
];

/** @type {PageSchema} */
export default {
  uiSchema: environment.isProduction()
    ? {
        [patientIdentificationFields.parentObject]: {
          'ui:title': (
            <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
              Tell us about the person whose records you're authorizing the
              release of
            </h3>
          ),
          [patientIdentificationFields.patientFullName]: fullNameDeprecatedUI,
          [patientIdentificationFields.patientSsn]: {
            ...ssnDeprecatedUI,
            'ui:required': () => true,
          },
          [patientIdentificationFields.patientVaFileNumber]: {
            'ui:title': 'VA file number (if applicable)',
            'ui:errorMessages': {
              pattern: 'Your VA file number must be 8 or 9 digits',
            },
            'ui:options': {
              replaceSchema: () => {
                return {
                  type: 'string',
                  pattern: '^\\d{8,9}$',
                };
              },
            },
          },
        },
      }
    : {
        [patientIdentificationFields.parentObject]: {
          ...titleUI({
            title:
              "Tell us about the person whose records you're authorizing the release of",
          }),
          [patientIdentificationFields.patientFullName]: fullNameUI(label =>
            getFullNameLabels(label, true),
          ),
          [patientIdentificationFields.patientSsn]: ssnUI(
            'Social Security number',
          ),
          [patientIdentificationFields.patientVaFileNumber]: vaFileNumberUI(
            'VA file number (if applicable)',
          ),
        },
      },
  schema: environment.isProduction()
    ? {
        type: 'object',
        properties: {
          [patientIdentificationFields.parentObject]: {
            type: 'object',
            required: [
              ...intersection(required, pageFields),
              [patientIdentificationFields.patientSsn],
            ],
            properties: pick(properties, pageFields),
          },
        },
      }
    : {
        type: 'object',
        properties: {
          [patientIdentificationFields.parentObject]: {
            type: 'object',
            required: ['patientFullName', 'patientSsn'],
            properties: {
              [patientIdentificationFields.patientFullName]: fullNameSchema,
              [patientIdentificationFields.patientSsn]: ssnSchema,
              [patientIdentificationFields.patientVaFileNumber]: vaFileNumberSchema,
            },
          },
        },
      },
};
