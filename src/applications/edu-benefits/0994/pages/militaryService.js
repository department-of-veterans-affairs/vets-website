import moment from 'moment';
import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import environment from 'platform/utilities/environment';
import { validateCurrentOrFutureDate } from 'platform/forms-system/src/js/validation';
import {
  activeDutyNotice,
  benefitNotice,
  notActiveBenefitNotice,
  remainingDaysGreaterThan180Notice,
  remainingDaysNotGreaterThan180Notice,
  selectedReserveNationalGuardExpectedDutyTitle,
} from '../content/militaryService';

const {
  activeDuty,
  activeDutyDuringVetTec,
  expectedActiveDutyStatusChange,
  expectedReleaseDate,
} = fullSchema.properties;

const expectedReleaseDateDaysRemaining = formData => {
  return moment(formData.expectedReleaseDate).diff(moment(), 'days');
};

const expectedReleaseDateValidYear = formData => {
  return (
    formData.expectedReleaseDate &&
    formData.expectedReleaseDate.split('-')[0].length === 4
  );
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
    'ui:required': formData =>
      formData.activeDuty && !environment.isProduction(),
    'ui:options': {
      hideIf: () => environment.isProduction(),
      expandUnder: 'activeDuty',
      expandUnderCondition: true,
    },
    'ui:validations': [validateCurrentOrFutureDate],
    'ui:errorMessages': {
      pattern: 'Please enter a valid date',
      required: 'Please enter a date',
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
          expectedReleaseDateValidYear(formData) &&
          expectedReleaseDateDaysRemaining(formData) > 180
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
          expectedReleaseDateValidYear(formData) &&
          expectedReleaseDateDaysRemaining(formData) <= 180
        );
      },
    },
  },
  'view:notActiveBenefitNotice': {
    'ui:title': '',
    'ui:description': notActiveBenefitNotice,
    'ui:options': {
      hideIf: () => environment.isProduction(),
      expandUnder: 'activeDuty',
      expandUnderCondition: false,
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
    'ui:options': {
      hideIf: () => !environment.isProduction(),
    },
  },
};

export const schema = {
  type: 'object',
  required: ['activeDuty'],
  properties: {
    activeDuty,
    activeDutyDuringVetTec,
    expectedReleaseDate,
    expectedActiveDutyStatusChange,
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
    'view:notActiveBenefitNotice': {
      type: 'object',
      properties: {},
    },
  },
};
