import {
  textUI,
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  selectUI,
  checkboxUI,
  checkboxSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  STATE_VALUES,
  STATE_NAMES,
  COUNTRY_VALUES,
  COUNTRY_NAMES,
} from './helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'When and where did your marriage end?',
      'If you were married at the time of their death, this will be their date and place of death.',
    ),
    marriageToVeteranEndDate: currentOrPastDateUI({
      title: 'Date marriage ended',
      monthSelect: false,
    }),
    marriageToVeteranEndOutsideUS: checkboxUI({
      title: 'My marriage ended outside the U.S.',
    }),
    marriageToVeteranEndLocation: {
      city: textUI('City'),
      state: {
        ...selectUI('State'),
        'ui:required': formData => !formData?.marriageToVeteranEndOutsideUS,
        'ui:options': {
          hideIf: formData => formData?.marriageToVeteranEndOutsideUS,
          labels: STATE_VALUES.reduce((acc, value, idx) => {
            acc[value] = STATE_NAMES[idx];
            return acc;
          }, {}),
        },
        'ui:errorMessages': {
          required: 'Please select a state',
        },
      },
      otherCountry: {
        ...selectUI('Country'),
        'ui:required': formData => formData?.marriageToVeteranEndOutsideUS,
        'ui:options': {
          hideIf: formData => !formData?.marriageToVeteranEndOutsideUS,
          labels: COUNTRY_VALUES.reduce((acc, value, idx) => {
            acc[value] = COUNTRY_NAMES[idx];
            return acc;
          }, {}),
        },
        'ui:errorMessages': {
          required: 'Please select a country',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['marriageToVeteranEndDate', 'marriageToVeteranEndLocation'],
    properties: {
      marriageToVeteranEndDate: currentOrPastDateSchema,
      marriageToVeteranEndOutsideUS: checkboxSchema,
      marriageToVeteranEndLocation: {
        type: 'object',
        required: ['city'],
        properties: {
          city: {
            type: 'string',
          },
          state: {
            type: 'string',
            enum: STATE_VALUES,
            enumNames: STATE_NAMES,
          },
          otherCountry: {
            type: 'string',
            enum: COUNTRY_VALUES,
            enumNames: COUNTRY_NAMES,
          },
        },
      },
    },
  },
};
