import { serviceStatus } from '../../schemaImports';

export const schema = serviceStatus;

export const uiSchema = {
  identity: {
    'ui:title': 'Which of these describes you?',
    'ui:widget': 'radio',
  },
};
