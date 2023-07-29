import {
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';

import { CLAIMANT_TYPES, CLAIMANT_TYPES_LABELS } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:claimantTypePgTitle': titleUI(
      'Is this the form I need?',
      'If you’re still gathering information to support your claim use this form to secure the earliest possible effective date for any retroactive payments you may be eligible to receive.',
    ),
    claimantType: {
      'ui:title': 'Which of these best describes you?',
      'ui:webComponentField': VaRadioField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: CLAIMANT_TYPES_LABELS,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimantType'],
    properties: {
      'view:claimantTypePgTitle': titleSchema,
      claimantType: {
        type: 'string',
        enum: Object.values(CLAIMANT_TYPES),
      },
    },
  },
};
