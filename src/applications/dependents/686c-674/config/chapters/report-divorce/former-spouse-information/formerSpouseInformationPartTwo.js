import {
  titleUI,
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
        explanationOfOther: {
          type: 'string',
        },
      },
      required: ['date', 'reasonMarriageEnded'],
    },
  },
};

export const uiSchema = {
  reportDivorce: {
    ...titleUI('When, where, and why did this marriage end?'),
    date: currentOrPastDateUI({
      title: 'Date of divorce',
      dataDogHidden: true,
      required: () => true,
    }),
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
            required: 'Enter the city where this occurred',
          },
          'ui:webComponentField': VaTextInputField,
        },
        state: {
          'ui:title': 'State',
          'ui:webComponentField': VaSelectField,
          'ui:errorMessages': {
            required: 'Select a state',
          },
          'ui:required': formData =>
            !formData?.reportDivorce?.divorceLocation?.outsideUsa,
          'ui:options': {
            hideIf: formData =>
              formData?.reportDivorce?.divorceLocation?.outsideUsa,
          },
        },
        country: {
          'ui:title': 'Country',
          'ui:webComponentField': VaSelectField,
          'ui:errorMessages': {
            required: 'Select a country',
          },
          'ui:required': formData =>
            formData?.reportDivorce?.divorceLocation?.outsideUsa,
          'ui:options': {
            hideIf: formData =>
              !formData?.reportDivorce?.divorceLocation?.outsideUsa,
          },
        },
      },
    },
    reasonMarriageEnded: radioUI({
      title: 'Reason marriage ended',
      labels: {
        Divorce: 'Divorce',
        Other: 'Annulment or other',
      },
    }),
    explanationOfOther: {
      'ui:title': 'Briefly describe how the marriage ended',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'reasonMarriageEnded',
        expandUnderCondition: 'Other',
        expandedContentFocus: true,
        preserveHiddenData: true,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.explanationOfOther['ui:collapsed']) {
          return { ...formSchema, required: ['date', 'reasonMarriageEnded'] };
        }
        return {
          ...formSchema,
          required: ['date', 'reasonMarriageEnded', 'explanationOfOther'],
        };
      },
    },
  },
};
