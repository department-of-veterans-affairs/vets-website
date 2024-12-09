import {
  titleUI,
  textUI,
  textSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import { customLocationSchema } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    reportDivorce: {
      type: 'object',
      properties: {
        date: currentOrPastDateSchema,
        divorceLocation: customLocationSchema,
        reasonMarriageEnded: radioSchema(['Divorce', 'Other']),
        explanationOfOther: textSchema,
      },
    },
  },
};

export const uiSchema = {
  reportDivorce: {
    ...titleUI('When, where, and why did this marriage end?'),
    date: {
      ...currentOrPastDateUI('Date of divorce'),
      'ui:required': () => true,
    },
    divorceLocation: {
      outsideUsa: {
        'ui:title': 'This occurred outside the U.S.',
        'ui:webComponentField': VaCheckboxField,
      },
      location: {
        city: {
          'ui:title': 'City',
          'ui:required': () => true,
          'ui:autocomplete': 'address-level2',
          'ui:errorMessages': {
            required: 'Enter the city where you were married',
          },
          'ui:webComponentField': VaTextInputField,
        },
        state: {
          'ui:title': 'State',
          'ui:webComponentField': VaSelectField,
          'ui:required': formData =>
            !formData?.reportDivorce?.divorceLocation?.outsideUsa,
          'ui:errorMessages': {
            required: 'Select a state',
          },
          'ui:options': {
            hideIf: formData =>
              formData?.reportDivorce?.divorceLocation?.outsideUsa,
          },
        },
      },
    },
    reasonMarriageEnded: radioUI({
      title: 'Reason marriage ended',
      required: () => true,
      labels: {
        Divorce: 'Divorce',
        Other: 'Annulment or other',
      },
    }),
    explanationOfOther: {
      ...textUI('Briefly describe how the marriage ended'),
      'ui:required': formData =>
        formData?.reportDivorce?.reasonMarriageEnded === 'Other',
      'ui:options': {
        expandUnder: 'reasonMarriageEnded',
        expandUnderCondition: 'Other',
        keepInPageOnReview: true,
      },
    },
  },
};
