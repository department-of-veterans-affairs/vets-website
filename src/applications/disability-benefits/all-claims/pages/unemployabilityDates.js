import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';
import monthYearUI from 'us-forms-system/lib/js/definitions/monthYear';

import { dateFieldsDescription } from '../content/unemployabilityDates';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  disabilityAffectedEmploymentFullTimeDate: monthYearUI(
    'Date you became too disabled to work',
  ),
  lastWorkedFullTimeDate: currentOrPastDateUI('Date you last worked full-time'),
  becameTooDisabledToWorkDate: currentOrPastDateUI(
    'Date your disability began to affect your full-time employment',
  ),
  'ui:unemployabilityDatesDesc': {
    'ui:description': dateFieldsDescription,
  },
};

export const schema = {
  type: 'object',
  required: ['disabilityAffectedEmploymentFullTimeDate'],
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
    'ui:unemployabilityDatesDesc': {
      type: 'object',
      properties: {},
    },
  },
};
