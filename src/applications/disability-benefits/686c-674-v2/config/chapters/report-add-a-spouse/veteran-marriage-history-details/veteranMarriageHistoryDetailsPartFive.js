import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import { customLocationSchema, generateHelpText } from '../../../helpers';
import { FormerSpouseHeader } from '../../../../components/SpouseViewField';

export const schema = {
  type: 'object',
  properties: {
    veteranMarriageHistory: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          endLocation: customLocationSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  veteranMarriageHistory: {
    items: {
      'ui:title': FormerSpouseHeader,
      endLocation: {
        'ui:title': 'Where did the marriage end?',
        'ui:description': generateHelpText(
          'If you got a divorce or an annulment, we want to know where you filed the paperwork. If the former spouse died, we want to know where the death certificate was filed',
        ),
        'ui:options': {
          labelHeaderLevel: '4',
        },
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
            'ui:required': (formData, index) =>
              !formData?.veteranMarriageHistory[`${index}`]?.endLocation
                ?.outsideUsa,
            'ui:errorMessages': {
              required: 'Select a state',
            },
            'ui:options': {
              hideIf: (formData, index) =>
                formData?.veteranMarriageHistory[`${index}`]?.endLocation
                  ?.outsideUsa,
            },
          },
        },
      },
    },
  },
};
