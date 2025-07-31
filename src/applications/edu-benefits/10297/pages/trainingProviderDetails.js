import {
  arrayBuilderItemFirstPageTitleUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { trainingProviderArrayOptions } from '../helpers';

const uiSchema = {
  ...arrayBuilderItemFirstPageTitleUI({
    title: 'Training provider name and mailing address',
    nounSingular: trainingProviderArrayOptions.nounSingular,
  }),
  providerName: textUI({
    title: 'Name of training provider',
    errorMessages: {
      required: 'You must provide a response',
    },
  }),
  providerAddress: addressNoMilitaryUI({}),
};

const schema = {
  type: 'object',
  required: ['providerName', 'providerAddress'],
  properties: {
    providerName: textSchema,
    providerAddress: addressNoMilitarySchema({}),
  },
};

export { schema, uiSchema };
