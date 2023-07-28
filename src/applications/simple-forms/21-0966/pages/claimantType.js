import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';

import { CLAIMANT_TYPES, CLAIMANT_TYPES_LABELS } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantType: {
      'ui:title': 'Is this the form I need?', // can't use JSX with VaRadioField
      'ui:description':
        // description doesn't work w/ VaRadioField
        'If you’re still gathering information to support your claim use this form to secure the earliest possible effective date for any retroactive payments you may be eligible to receive. ',
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
      claimantType: {
        type: 'string',
        enum: Object.values(CLAIMANT_TYPES),
      },
    },
  },
};
