import {
  titleUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI({
    title: 'Use a previously entered point of contact',
    description:
      'You can choose someone you’ve already entered on this form as the point of contact for this location. If you select “None of the above,” you’ll be able to enter a new point of contact on the next page.',
  }),

  previouslyEnteredPointOfContact: {
    ...radioUI({
      title:
        'Select a name below to use them as the point of contact for this additional location.',
      hint: '',
      labels: {
        none: 'None of the above',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    previouslyEnteredPointOfContact: {
      type: 'string',
      enum: ['none'],
    },
  },
  required: ['previouslyEnteredPointOfContact'],
};
export { uiSchema, schema };
