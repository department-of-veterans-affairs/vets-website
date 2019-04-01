import { PTSD_CHANGE_LABELS } from '../constants';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { changeDescription } from '../content/workBehaviorChanges';

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': changeDescription,
  workBehaviorChanges: {
    changeAssignment: {
      'ui:title': PTSD_CHANGE_LABELS.changeAssignment,
    },
    increasedLeave: {
      'ui:title': PTSD_CHANGE_LABELS.increasedLeave,
    },
    withoutLeave: {
      'ui:title': PTSD_CHANGE_LABELS.withoutLeave,
    },
    performanceChanges: {
      'ui:title': PTSD_CHANGE_LABELS.performanceChanges,
    },
    economicChanges: {
      'ui:title': PTSD_CHANGE_LABELS.economicChanges,
    },
    resign: {
      'ui:title': PTSD_CHANGE_LABELS.resign,
    },
    other: {
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
      'ui:title': 'None of these apply to me',
    },
  },
};

export const schema = {
  type: 'object',

  properties: {
    workBehaviorChanges: {
      type: 'object',
      properties: {
        changeAssignment: {
          type: 'boolean',
        },
        increasedLeave: {
          type: 'boolean',
        },
        withoutLeave: {
          type: 'boolean',
        },
        performanceChanges: {
          type: 'boolean',
        },
        economicChanges: {
          type: 'boolean',
        },
        resign: {
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
