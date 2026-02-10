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
} from '../../../utils/labels';
import { customAddressSchema } from '../../definitions';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('When and where did you get married?'),
    marriageToVeteranStartDate: currentOrPastDateUI({
      title: 'Date of marriage',
      monthSelect: false,
    }),
    marriageToVeteranStartOutsideUS: checkboxUI({
      title: 'I got married outside the U.S.',
    }),
    marriageToVeteranStartLocation: {
      city: textUI('City'),
      state: {
        ...selectUI('State'),
        'ui:required': formData => !formData?.marriageToVeteranStartOutsideUS,
        'ui:options': {
          hideIf: formData => formData?.marriageToVeteranStartOutsideUS,
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
        'ui:required': formData => formData?.marriageToVeteranStartOutsideUS,
        'ui:options': {
          hideIf: formData => !formData?.marriageToVeteranStartOutsideUS,
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
    required: ['marriageToVeteranStartDate', 'marriageToVeteranStartLocation'],
    properties: {
      marriageToVeteranStartDate: currentOrPastDateSchema,
      marriageToVeteranStartOutsideUS: checkboxSchema,
      marriageToVeteranStartLocation: customAddressSchema,
    },
  },
};
