import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import {
  customLocationSchema,
  STATE_NAMES,
  STATE_VALUES,
} from '../../../helpers';
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
          endLocation: customLocationSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  spouseMarriageHistory: {
    items: {
      'ui:title': FormerSpouseHeader,
      endLocation: {
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
            !formData?.currentMarriageInformation?.marriedOutsideUsa,
          'ui:errorMessages': {
            required: 'Select a state',
          },
          'ui:options': {
            updateSchema: (formData, _schema, _uiSchema) => {
              const updatedSchemaUI = _uiSchema;
              const location = formData?.currentMarriageInformation?.location;
              const marriedOutsideUsa =
                formData?.currentMarriageInformation?.marriedOutsideUsa;

              if (marriedOutsideUsa) {
                updatedSchemaUI['ui:options'].inert = true;
                location.state = undefined;
                return {
                  type: 'string',
                  enum: STATE_VALUES,
                  enumNames: STATE_NAMES,
                };
              }

              updatedSchemaUI['ui:options'].inert = false;
              return {
                type: 'string',
                enum: STATE_VALUES,
                enumNames: STATE_NAMES,
              };
            },
          },
        },
      },
    },
  },
};
