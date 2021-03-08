import moment from 'moment';
import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import environment from 'platform/utilities/environment';
import {
  activeDutyNotice,
  benefitNotice,
  remainingDaysGreaterThan180Notice,
  remainingDaysNotGreaterThan180Notice,
  selectedReserveNationalGuardExpectedDutyTitle,
} from '../content/militaryService';

const { activeDuty, activeDutyDuringVetTec } = fullSchema.properties;

const daysRemaining = formData => {
  return moment(formData.expectedReleaseDate).diff(moment(), 'days');
};

export const uiSchema = {
  activeDuty: {
    'ui:title':
      "Are you on full-time duty in the Armed Forces? (This doesn't include active-duty training for Reserve and National Guard members.)",
    'ui:widget': 'yesNo',
  },
  'view:activeDutyNotice': {
    'ui:description': activeDutyNotice,
    'ui:options': {
      hideIf: () => !environment.isProduction(),
      expandUnder: 'activeDuty',
      expandUnderCondition: true,
    },
  },
  expectedReleaseDate: {
    'ui:title': 'Enter the date you expect to be released from active duty.',
    'ui:widget': 'date',
    'ui:required': formData => formData.activeDuty,
    'ui:options': {
      hideIf: () => environment.isProduction(),
      expandUnder: 'activeDuty',
      expandUnderCondition: true,
    },
  },
  'view:remainingDaysGreaterThan180Notice': {
    'ui:title': '',
    'ui:description': remainingDaysGreaterThan180Notice,
    'ui:options': {
      hideIf: () => environment.isProduction(),
      expandUnder: 'activeDuty',
      expandUnderCondition: (value, formData) => {
        return (
          value === true &&
          formData.expectedReleaseDate &&
          daysRemaining(formData) > 180
        );
      },
    },
  },
  'view:remainingDaysNotGreaterThan180Notice': {
    'ui:title': '',
    'ui:description': remainingDaysNotGreaterThan180Notice,
    expandUnder: 'activeDuty',
    'ui:options': {
      hideIf: () => environment.isProduction(),
      expandUnder: 'activeDuty',
      expandUnderCondition: (value, formData) => {
        return (
          value === true &&
          formData.expectedReleaseDate &&
          daysRemaining(formData) <= 180
        );
      },
    },
  },
  expectedActiveDutyStatusChange: {
    'ui:title':
      'Do you expect to be called to active duty while enrolled in a VET TEC program?',
    'ui:widget': 'yesNo',
    'ui:options': {
      hideIf: () => environment.isProduction(),
      expandUnder: 'activeDuty',
      expandUnderCondition: false,
    },
  },
  activeDutyDuringVetTec: {
    'ui:title': selectedReserveNationalGuardExpectedDutyTitle,
    'ui:widget': 'yesNo',
    'ui:options': {
      hideIf: () => !environment.isProduction(),
    },
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
    activeDutyDuringVetTec,
    expectedReleaseDate: {
      pattern:
        '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
      type: 'string',
    },
    expectedActiveDutyStatusChange: {
      type: 'boolean',
    },
    'view:activeDutyNotice': {
      type: 'object',
      properties: {},
    },
    'view:remainingDaysGreaterThan180Notice': {
      type: 'object',
      properties: {},
    },
    'view:remainingDaysNotGreaterThan180Notice': {
      type: 'object',
      properties: {},
    },
    'view:benefitNotice': {
      type: 'object',
      properties: {},
    },
  },
};
