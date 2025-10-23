import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import { PTSD_CHANGE_LABELS } from '../constants';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { changeDescription } from '../content/socialBehaviorChanges';

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': changeDescription,
  socialBehaviorChanges: {
    breakup: {
      'ui:webComponentField': VaCheckboxField,
      'ui:title': PTSD_CHANGE_LABELS.breakup,
    },
    increasedDisregard: {
      'ui:webComponentField': VaCheckboxField,
      'ui:title': PTSD_CHANGE_LABELS.increasedDisregard,
    },
    withdrawal: {
      'ui:webComponentField': VaCheckboxField,
      'ui:title': PTSD_CHANGE_LABELS.withdrawal,
    },
    unexplained: {
      'ui:webComponentField': VaCheckboxField,
      'ui:title': PTSD_CHANGE_LABELS.unexplained,
    },
    other: {
      'ui:webComponentField': VaCheckboxField,
      'ui:title': 'Other',
    },
    otherExplanation: {
      'ui:title': 'Please describe',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        maxLength: 32000,
        expandUnder: 'other',
      },
    },
    noneApply: {
      'ui:webComponentField': VaCheckboxField,
      'ui:title': 'None of these apply to me',
    },
  },
};

export const schema = {
  type: 'object',

  properties: {
    socialBehaviorChanges: {
      type: 'object',
      properties: {
        breakup: {
          type: 'boolean',
        },
        increasedDisregard: {
          type: 'boolean',
        },
        withdrawal: {
          type: 'boolean',
        },
        unexplained: {
          type: 'boolean',
        },
        other: {
          type: 'boolean',
        },
        otherExplanation: {
          type: 'string',
        },
        noneApply: {
          type: 'boolean',
        },
      },
    },
  },
};
