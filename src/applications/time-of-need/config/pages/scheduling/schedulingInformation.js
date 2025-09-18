import React from 'react';
import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const timeOptions = [
  { value: '8-10' },
  { value: '10-12' },
  { value: '12-2' },
  { value: '2-4' },
  { value: 'none' },
];
const dayOptions = [
  { value: 'monday' },
  { value: 'tuesday' },
  { value: 'wednesday' },
  { value: 'thursday' },
  { value: 'friday' },
  { value: 'none' },
];

const timeLabels = {
  '8-10': '8:00 - 10:00 A.M.',
  '10-12': '10:00 - 12:00 P.M.',
  '12-2': '12:00 - 2:00 P.M.',
  '2-4': '2:00 - 4:00 P.M.',
  none: 'No preference',
};
const dayLabels = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  none: 'No preference',
};

const timeKeys = timeOptions.map(o => o.value);
const dayKeys = dayOptions.map(o => o.value);

const exclusiveNone = (errors, selected) => {
  if (
    Array.isArray(selected) &&
    selected.includes('none') &&
    selected.length > 1
  ) {
    errors.addError('Remove other selections or remove No preference.');
  }
};

/** @type {PageSchema} */
const schedulingInformation = {
  path: 'scheduling-information',
  title: 'Preferred scheduling details',
  uiSchema: {
    ...titleUI('Preferred scheduling details'),
    preferredBurialTimes: {
      ...checkboxGroupUI({
        title: 'What is your preferred time of day for a burial?',
        description: 'If you have no time preference, select No preference.',
        required: true,
        options: timeOptions,
        labels: timeLabels,
        errorMessages: {
          required: 'Select at least one time or No preference.',
        },
      }),
      'ui:options': { useV3: true },
      'ui:validations': [exclusiveNone],
    },
    preferredBurialDays: {
      ...checkboxGroupUI({
        title: 'What is your preferred day of the week for a burial?',
        description: 'If you have no day preference, select No preference.',
        required: true,
        options: dayOptions,
        labels: dayLabels,
        errorMessages: {
          required: 'Select at least one day or No preference.',
        },
      }),
      'ui:options': { useV3: true },
      'ui:validations': [exclusiveNone],
    },
    'view:schedulingInfo': {
      'ui:field': () => (
        <va-additional-info trigger="Learn more about scheduling">
          <p className="vads-u-margin--0">Content about scheduling</p>
        </va-additional-info>
      ),
    },
    'ui:order': [
      'preferredBurialTimes',
      'preferredBurialDays',
      'view:schedulingInfo',
    ],
  },
  schema: {
    type: 'object',
    required: ['preferredBurialTimes', 'preferredBurialDays'],
    properties: {
      preferredBurialTimes: checkboxGroupSchema(timeKeys),
      preferredBurialDays: checkboxGroupSchema(dayKeys),
      'view:schedulingInfo': { type: 'object', properties: {} },
    },
  },
};

export default schedulingInformation;
