import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';

import {
  dateFieldsDescription,
  dateDescription,
} from '../content/unemployabilityDates';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': dateDescription,
  unemployability: {
    disabilityAffectedEmploymentFullTimeDate: currentOrPastDateUI(
      'Approximately when did you become too disabled to work? (If you don’t remember the exact date, you can give us an estimated date.)',
    ),
    lastWorkedFullTimeDate: currentOrPastDateUI(
      'When did you last work full-time?',
    ),
    becameTooDisabledToWorkDate: currentOrPastDateUI(
      'When did your disability begin to affect your full-time job?',
    ),
    'view:unemployabilityDatesDesc': {
      'ui:description': dateFieldsDescription,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['disabilityAffectedEmploymentFullTimeDate'],
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        disabilityAffectedEmploymentFullTimeDate: {
          $ref: '#/definitions/date',
        },
        lastWorkedFullTimeDate: {
          $ref: '#/definitions/date',
        },
        becameTooDisabledToWorkDate: {
          $ref: '#/definitions/date',
        },
        'view:unemployabilityDatesDesc': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
