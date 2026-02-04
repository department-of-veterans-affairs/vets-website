import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';
import constants from 'vets-json-schema/dist/constants.json';
import { validateWhiteSpace } from 'platform/forms/validations';

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
addressUI.state['ui:required'] = () => true;
addressUI.state['ui:errorMessages'] = {
  required: 'Select a state',
  enum: 'Select a state',
};
delete addressUI.state['ui:options'].replaceSchema;

const uiSchema = {
  ...titleUI(
    'The name and mailing address of the organization giving the prep course',
    'Provide the name of the organization giving the prep course.',
  ),
  prepCourseOrganizationName: {
    ...textUI({
      title: 'Organization name',
      required: () => true,
      validations: [validateWhiteSpace],
      errorMessages: {
        required: 'Please provide the name of the organization',
      },
    }),
  },
  prepCourseOrganizationAddress: addressUI,
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
    prepCourseOrganizationName: textSchema,
    prepCourseOrganizationAddress: addressSchema,
  },
  required: ['prepCourseOrganizationName', 'prepCourseOrganizationAddress'],
};

export { schema, uiSchema };
