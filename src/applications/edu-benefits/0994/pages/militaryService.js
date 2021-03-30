import moment from 'moment';
import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import { validateCurrentOrFutureDate } from 'platform/forms-system/src/js/validation';
import {
  notActiveBenefitNotice,
  remainingDaysGreaterThan180Notice,
  remainingDaysNotGreaterThan180Notice,
} from '../content/militaryService';

const {
  activeDuty,
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
  expectedReleaseDate: {
    'ui:title': 'Enter the date you expect to be released from active duty.',
    'ui:widget': 'date',
    'ui:required': formData => formData.activeDuty,
    'ui:options': {
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
      hideIf: formData => formData.activeDuty !== false,
      expandUnder: 'activeDuty',
      expandUnderCondition: false,
    },
  },
  expectedActiveDutyStatusChange: {
    'ui:title':
      'Do you expect to be called to active duty while enrolled in a VET TEC program?',
    'ui:widget': 'yesNo',
    'ui:options': {
      expandUnder: 'activeDuty',
      expandUnderCondition: false,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['activeDuty'],
  properties: {
    activeDuty,
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
    'view:notActiveBenefitNotice': {
      type: 'object',
      properties: {},
    },
  },
};
