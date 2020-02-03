import { genericTextinput, genericNumberInput } from '../../../generic-schema';

export const schema = {
  type: 'object',
  required: ['first', 'last', 'ssn'],
  properties: {
    first: genericTextinput,
    middle: genericTextinput,
    last: genericTextinput,
    ssn: genericNumberInput,
  },
};

export const uiSchema = {
  first: {
    'ui:title': 'Your first Name',
  },
  middle: {
    'ui:title': 'Your middle Name',
  },
  last: {
    'ui:title': 'Your last Name',
  },
  ssn: {
    'ui:title': 'Your social security number',
  },
};

/*
uiSchema: {
            [formFields.firstName]: {
              'ui:title': 'First Name',
            },
          },
          schema: {
            required: [formFields.firstName],
            type: 'object',
            properties: {
              [formFields.firstName]: {
                type: 'string',
              },
            },
          },
*/
