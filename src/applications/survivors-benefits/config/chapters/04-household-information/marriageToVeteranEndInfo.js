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
import { validations } from '../../validations';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      formData =>
        formData.marriedToVeteranAtTimeOfDeath
          ? 'Where did your marriage end?'
          : 'When and where did your marriage end?',
      formData =>
        formData.marriedToVeteranAtTimeOfDeath
          ? 'If you were married at the time of their death, this will be their place of death.'
          : 'If you were married at the time of their death, this will be their date and place of death.',
    ),
    marriageToVeteranEndDate: {
      ...currentOrPastDateUI({
        title: 'Date marriage ended',
        monthSelect: false,
        validations: [validations.isAfterMarriageStartDate],
        required: formData => formData.marriedToVeteranAtTimeOfDeath === false,
        hideIf: formData => formData.marriedToVeteranAtTimeOfDeath === true,
      }),
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
    required: ['marriageToVeteranEndLocation'],
    properties: {
      marriageToVeteranEndDate: currentOrPastDateSchema,
      marriageToVeteranEndOutsideUs: checkboxSchema,
      marriageToVeteranEndLocation: customAddressSchema,
    },
  },
};
