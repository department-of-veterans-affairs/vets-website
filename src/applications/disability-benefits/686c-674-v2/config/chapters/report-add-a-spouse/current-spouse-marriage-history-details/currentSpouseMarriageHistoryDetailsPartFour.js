import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import { customLocationSchema } from '../../../helpers';
import { FormerSpouseHeader } from '../../../../components/SpouseViewField';

export const schema = {
  type: 'object',
  properties: {
    spouseMarriageHistory: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          startLocation: customLocationSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  spouseMarriageHistory: {
    items: {
      'ui:title': FormerSpouseHeader,
      startLocation: {
        marriedOutsideUsa: {
          'ui:title': 'I got married outside the U.S.',
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
              !formData?.spouseMarriageHistory[`${index}`]?.startLocation
                ?.marriedOutsideUsa,
            'ui:errorMessages': {
              required: 'Select a state',
            },
            'ui:options': {
              updateSchema: (formData, _schema, _uiSchema, index) => {
                const updatedSchemaUI = { ..._uiSchema };
                const updatedSchema = { ..._schema };
                const location =
                  formData?.spouseMarriageHistory[`${index}`]?.startLocation
                    ?.location;
                const marriedOutsideUsa =
                  formData?.spouseMarriageHistory[`${index}`]?.startLocation
                    ?.marriedOutsideUsa;

                if (marriedOutsideUsa) {
                  updatedSchemaUI['ui:options'].inert = true;
                  location.state = undefined;
                  return updatedSchema;
                }

                updatedSchemaUI['ui:options'].inert = false;
                return updatedSchema;
              },
            },
          },
        },
      },
    },
  },
};
