import {
  radioUI,
  radioSchema,
  titleUI,
  descriptionUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Disclose your personal information to a third party'),
  ...descriptionUI(
    'We will give your personal benefit or claim information to a third party of your choosing. You may select only 1 person or 1 organization. This form cannot be used to disclose federal tax information, provide copies of letters and notifications or allow any type of changes to the claimant’s VA record, such as address, email, or direct deposit.',
  ),
  discloseInformation: {
    authorize: radioUI({
      title:
        'Do you authorize us to disclose your personal information to a specific person or to an organization?',
      labels: {
        person: 'Person',
        organization: 'Organization',
      },
      errorMessages: {
        required: 'You must provide a response',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    discloseInformation: {
      type: 'object',
      properties: {
        authorize: radioSchema(['person', 'organization']),
      },
      required: ['authorize'],
    },
  },
};

export { schema, uiSchema };
