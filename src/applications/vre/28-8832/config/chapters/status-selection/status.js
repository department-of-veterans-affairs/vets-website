import { status } from '../../utilities';

export const schema = {
  type: 'object',
  properties: {
    status,
  },
};

export const uiSchema = {
  status: {
    'ui:title': 'Select one of the options below.',
    'ui:widget': 'radio',
    'ui:required': () => true,
  },
};
