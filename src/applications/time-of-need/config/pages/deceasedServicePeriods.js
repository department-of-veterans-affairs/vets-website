import React from 'react';
import {
  textSchema,
  textUI,
  // selectSchema,
  selectUI,
  currentOrPastDateDigitsSchema,
  currentOrPastDateDigitsUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const ServicePeriodViewField = () => <></>;

const rankOptions = [
  { value: '', label: 'Select rank' },
  { value: 'private', label: 'Private' },
  { value: 'sergeant', label: 'Sergeant' },
  { value: 'lieutenant', label: 'Lieutenant' },
  { value: 'captain', label: 'Captain' },
  { value: 'major', label: 'Major' },
  { value: 'colonel', label: 'Colonel' },
  { value: 'general', label: 'General' },
  { value: 'other', label: 'Other' },
];

const dischargeOptions = [
  { value: '', label: 'Select character' },
  { value: 'honorable', label: 'Honorable' },
  { value: 'general', label: 'General (Under Honorable Conditions)' },
  { value: 'otherThanHonorable', label: 'Other Than Honorable' },
  { value: 'badConduct', label: 'Bad Conduct' },
  { value: 'dishonorable', label: 'Dishonorable' },
  { value: 'entryLevelSeparation', label: 'Entry Level Separation' },
  { value: 'uncharacterized', label: 'Uncharacterized' },
  { value: 'unknown', label: 'Unknown' },
];

export default {
  uiSchema: {
    'ui:description': (
      <h3 className="vads-u-font-size--h3 vads-u-font-weight--bold vads-u-margin-bottom--2">
        Deceased’s service period(s)
      </h3>
    ),
    servicePeriods: {
      'ui:options': {
        viewField: ServicePeriodViewField,
        itemName: 'service period',
        addLabel: 'Add another service period',
      },
      items: {
        branchOfService: textUI({
          title: 'Branch of service',
          'ui:required': true,
          'ui:errorMessages': {
            required: 'Branch of service is required',
          },
        }),
        highestRank: selectUI({
          title: 'Highest rank attained',
          options: rankOptions,
        }),
        dischargeCharacter: selectUI({
          title: 'Discharge character of service',
          'ui:required': true,
          options: dischargeOptions,
          'ui:errorMessages': {
            required: 'Discharge character is required',
          },
        }),
        serviceStartDate: currentOrPastDateDigitsUI({
          title: 'Service start date',
          'ui:options': {
            hint:
              'Please enter two digits for the month and day and four digits for the year.',
          },
        }),
        serviceEndDate: currentOrPastDateDigitsUI({
          title: 'Service end date',
          'ui:options': {
            hint:
              'Please enter two digits for the month and day and four digits for the year.',
          },
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      servicePeriods: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['branchOfService', 'dischargeCharacter'],
          properties: {
            branchOfService: textSchema,
            highestRank: {
              type: 'string',
              title: 'Highest rank attained',
              enum: rankOptions.map(opt => opt.value),
              enumNames: rankOptions.map(opt => opt.label),
            },
            dischargeCharacter: {
              type: 'string',
              title: 'Discharge character of service',
              enum: dischargeOptions.map(opt => opt.value),
              enumNames: dischargeOptions.map(opt => opt.label),
            },
            serviceStartDate: currentOrPastDateDigitsSchema,
            serviceEndDate: currentOrPastDateDigitsSchema,
          },
        },
      },
    },
    required: ['servicePeriods'],
  },
};
