import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import {
  activeDutyNotice,
  benefitNotice,
  selectedReserveNationalGuardExpectedDutyTitle,
} from '../content/militaryService';

const { activeDuty, activeDutyDuringVetTec } = fullSchema.properties;

export const uiSchema = {
  activeDuty: {
    'ui:title':
      "Are you on full-time duty in the Armed Forces? (This doesn't include active-duty training for Reserve and National Guard members.)",
    'ui:widget': 'yesNo',
  },
  'view:activeDutyNotice': {
    'ui:description': activeDutyNotice,
    'ui:options': {
      expandUnder: 'activeDuty',
      expandUnderCondition: true,
    },
  },
  activeDutyDuringVetTec: {
    'ui:title': selectedReserveNationalGuardExpectedDutyTitle,
    'ui:widget': 'yesNo',
  },
  'view:benefitNotice': {
    'ui:title': '',
    'ui:description': benefitNotice,
  },
};

export const schema = {
  type: 'object',
  required: ['activeDuty'],
  properties: {
    activeDuty,
    'view:activeDutyNotice': {
      type: 'object',
      properties: {},
    },
    activeDutyDuringVetTec,
    'view:benefitNotice': {
      type: 'object',
      properties: {},
    },
  },
};
