import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const communicationAddressOptions = {
  HOME: 'Home',
  WORK: 'Work',
  OTHER: 'Other',
};

/** @type {PageSchema} */
export default {
  title: 'Preferred address for communication',
  path: 'communication-address',
  uiSchema: {
    communicationAddress: radioUI({
      title:
        'What address would you like to receive communication from the VA?',
      labels: communicationAddressOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      communicationAddress: radioSchema(
        Object.keys(communicationAddressOptions),
      ),
    },
    required: ['communicationAddress'],
  },
};
