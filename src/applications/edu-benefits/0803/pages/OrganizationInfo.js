// @ts-check
import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';
import constants from 'vets-json-schema/dist/constants.json';

const filteredStates = constants.states.USA.filter(
  state => !['AP', 'AE', 'AA'].includes(state.value),
);
const STATE_VALUES = filteredStates.map(state => state.value);
const STATE_NAMES = filteredStates.map(state => state.label);

// We want to omit the 'Country' input but make it seems as if
// 'USA' has been selected. This requires a little extra work
// to get the 'State' field to be a dropdown of US States
// rather than a free-form text field.
const addressUI = addressNoMilitaryUI({ omit: ['country'] });
addressUI.state['ui:webComponentField'] = VaSelectField;
addressUI.state['ui:errorMessages'] = {
  required: 'Select a state',
  enum: 'Select a state',
};
delete addressUI.state['ui:options'].replaceSchema;

const uiSchema = {
  ...titleUI(
    'Name and address of organization issuing the license or certification',
    'To qualify for reimbursement, the organization must be located in the United States.',
  ),
  organizationName: {
    ...textUI({
      title: 'Name of organization',
      required: () => true,
      errorMessages: {
        required: 'Enter the name of the organization',
      },
    }),
  },
  organizationAddress: addressUI,
};

const addressSchema = addressNoMilitarySchema({ omit: ['country'] });
addressSchema.properties.state = {
  type: 'string',
  title: 'State',
  enum: STATE_VALUES,
  enumNames: STATE_NAMES,
};

const schema = {
  type: 'object',
  properties: {
    organizationName: textSchema,
    organizationAddress: addressSchema,
  },
  required: ['organizationName', 'organizationAddress'],
};

export { schema, uiSchema };
