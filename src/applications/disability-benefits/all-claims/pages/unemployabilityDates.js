import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import {
  dateFieldsDescription,
  dateDescription,
} from '../content/unemployabilityDates';

import { unemployabilityTitle } from '../content/unemployabilityFormIntro';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const {
  disabilityAffectedEmploymentFullTimeDate,
  lastWorkedFullTimeDate,
  becameTooDisabledToWorkDate,
} = fullSchema.properties.form8940.properties.unemployability.properties;

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
  properties: {
    unemployability: {
      type: 'object',
      required: ['disabilityAffectedEmploymentFullTimeDate'],
      properties: {
        disabilityAffectedEmploymentFullTimeDate,
        lastWorkedFullTimeDate,
        becameTooDisabledToWorkDate,
        'view:unemployabilityDatesDesc': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
