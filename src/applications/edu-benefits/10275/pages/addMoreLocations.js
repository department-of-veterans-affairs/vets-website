import {
  titleUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI({
    title: 'You can add more locations to this agreement',
    description:
      'If you have any more campuses or additional locations to add to this agreement, you can do so now. You will need a facility code for each location you would like to add.',
  }),
  addMoreLocations: {
    ...radioUI({
      title:
        'Do you have any additional locations  you’d like to add to this agreement? ',
      hint: '',
      labels: {
        yes: 'Yes, I have additional locations to add',
        no: 'No, I don’t have additional locations to add',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    addMoreLocations: {
      type: 'string',
      enum: ['yes', 'no'],
    },
  },
  required: ['addMoreLocations'],
};

export { uiSchema, schema };
