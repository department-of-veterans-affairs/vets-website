import { communicationPreferences } from '../../schemaImports';

export const schema = communicationPreferences;

export const uiSchema = {
  preferredMethod: {
    'ui:title': 'If we have questions, how do you want us to contact you?',
    'ui:required': () => true,
    'ui:widget': 'radio',
  },
};
