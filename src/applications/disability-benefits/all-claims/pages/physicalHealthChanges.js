import { PTSD_CHANGE_LABELS } from '../constants';
import { changeDescription } from '../content/physicalHealthChanges';
import { ptsd781aNameTitle } from '../content/ptsdClassification';

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': changeDescription,
  physicalChanges: {
    increasedVisits: {
      'ui:title': PTSD_CHANGE_LABELS.increasedVisits,
    },
    pregnancyTests: {
      'ui:title': PTSD_CHANGE_LABELS.pregnancyTests,
    },
    hivTests: {
      'ui:title': PTSD_CHANGE_LABELS.hivTests,
    },
    weightChanges: {
      'ui:title': PTSD_CHANGE_LABELS.weightChanges,
    },
    lethargy: {
      'ui:title': PTSD_CHANGE_LABELS.lethargy,
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
    physicalChanges: {
      type: 'object',
      properties: {
        increasedVisits: {
          type: 'boolean',
        },
        pregnancyTests: {
          type: 'boolean',
        },
        hivTests: {
          type: 'boolean',
        },
        weightChanges: {
          type: 'boolean',
        },
        lethargy: {
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
