import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { claimantRelationshipOptions } from '../../../utils/labels';
import { seriouslyDisabledDescription } from '../../../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Claimant’s relationship to the Veteran'),
    claimantRelationship: radioUI({
      title: 'What is the claimant’s relationship to the Veteran?',
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
