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

const validation = {
  pattern: (errors, values, formData) => {
    if (formData?.marriageToVeteranStartDate) {
      const endDate = new Date(values);
      const startDate = new Date(formData.marriageToVeteranStartDate);
      if (endDate.getTime() < startDate.getTime()) {
        errors.addError(
          'The date marriage ended must be after the date marriage started',
        );
      }
    }
  },
  widget: (errors, value) => {
    if ((value || '').trim() === '') {
      errors.addError('Check at least one!');
    }
  },
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'When and where did your marriage end?',
      'If you were married at the time of their death, this will be their date and place of death.',
    ),
    marriageToVeteranEndDate: {
      ...currentOrPastDateUI({
        title: 'Date marriage ended',
        monthSelect: false,
      }),
      'ui:validations': [validation.pattern],
    },
    marriageToVeteranEndOutsideUs: checkboxUI({
      title: 'My marriage ended outside the U.S.',
    }),
    marriageToVeteranEndLocation: {
      city: textUI('City'),
      state: {
        ...selectUI('State'),
        'ui:required': formData => !formData?.marriageToVeteranEndOutsideUs,
        'ui:options': {
          hideIf: formData => formData?.marriageToVeteranEndOutsideUs,
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
        'ui:required': formData => formData?.marriageToVeteranEndOutsideUs,
        'ui:options': {
          hideIf: formData => !formData?.marriageToVeteranEndOutsideUs,
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
      marriageToVeteranEndOutsideUs: checkboxSchema,
      marriageToVeteranEndLocation: customAddressSchema,
    },
  },
};
