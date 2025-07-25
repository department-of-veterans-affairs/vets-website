import {
  arrayBuilderItemFirstPageTitleUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { trainingProviderArrayOptions } from '../helpers';

const trainingProviderDetails = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Training provider name and mail address',
      nounSingular: trainingProviderArrayOptions.nounSingular,
    }),
    name: textUI({
      title: 'Name of training provider',
      errorMessages: {
        required: 'You must provide a response',
      },
    }),
    address: addressNoMilitaryUI({}),
  },
  schema: {
    type: 'object',
    required: ['name', 'address'],
    properties: {
      name: textSchema,
      address: addressNoMilitarySchema({}),
    },
  },
};

export { trainingProviderDetails };
