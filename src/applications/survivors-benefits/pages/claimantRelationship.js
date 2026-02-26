import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
// import { claimantRelationshipOptions } from '../utils/labels';
import { seriouslyDisabledDescription } from '../utils/helpers';

export const claimantRelationshipOptions = {
  SURVIVING_SPOUSE: 'Surviving spouse',
  CUSTODIAN_FILING_FOR_CHILD_UNDER_18: 'Custodian filing for child under 18',
  'CHILD_18-23_IN_SCHOOL':
    'Adult child who is 18-23 years old and still in school',
  HELPLESS_ADULT_CHILD: 'Adult child who is seriously disabled',
  NONE: 'None of these options apply to me',
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your relationship to the Veteran'),
    claimantRelationship: radioUI({
      title: 'What’s your relationship to the Veteran?',
      labels: claimantRelationshipOptions,
      errorMessages: {
        required: 'Select what your relationship is to the Veteran',
      },
    }),
    seriouslyDisabled: {
      'ui:description': seriouslyDisabledDescription,
    },
  },
  schema: {
    type: 'object',
    required: ['claimantRelationship'],
    properties: {
      claimantRelationship: radioSchema(
        Object.keys(claimantRelationshipOptions),
      ),
      seriouslyDisabled: {
        type: 'object',
        properties: {},
      },
    },
  },
};
