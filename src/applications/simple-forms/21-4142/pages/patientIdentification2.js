import {
  titleUI,
  fullNameUI,
  vaFileNumberUI,
  ssnUI,
  fullNameSchema,
  ssnSchema,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { merge } from 'lodash';
import { patientIdentificationFields } from '../definitions/constants';
import { getFullNameLabels } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [patientIdentificationFields.parentObject]: {
      ...titleUI({
        title:
          "Tell us about the person whose records you're authorizing the release of",
      }),
      [patientIdentificationFields.patientFullName]: merge(
        {},
        fullNameUI(label => getFullNameLabels(label, true)),
        {
          first: {
            'ui:options': {
              hint: '(Max. 12 characters)',
            },
          },
          last: {
            'ui:options': {
              hint: '(Max. 18 characters)',
            },
          },
        },
      ),
      [patientIdentificationFields.patientSsn]: ssnUI('Social Security number'),
      [patientIdentificationFields.patientVaFileNumber]: vaFileNumberUI(
        'VA file number (if applicable)',
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [patientIdentificationFields.parentObject]: {
        type: 'object',
        required: ['patientFullName', 'patientSsn'],
        properties: {
          [patientIdentificationFields.patientFullName]: merge(
            {},
            fullNameSchema,
            {
              properties: {
                first: {
                  maxLength: 12,
                },
                last: {
                  maxLength: 18,
                },
              },
            },
          ),
          [patientIdentificationFields.patientSsn]: ssnSchema,
          [patientIdentificationFields.patientVaFileNumber]: vaFileNumberSchema,
        },
      },
    },
  },
};
