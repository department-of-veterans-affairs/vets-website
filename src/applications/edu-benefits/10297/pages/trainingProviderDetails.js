import {
  arrayBuilderItemFirstPageTitleUI,
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  addressUiSchema,
  trainingProviderArrayOptions,
  addressSpecifications,
} from '../helpers';

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
  providerAddress: addressUiSchema({ baseUiSchema: addressNoMilitaryUI({}) }),
};

const schema = {
  type: 'object',
  required: ['providerName', 'providerAddress'],
  properties: {
    providerName: {
      type: 'string',
      minLength: 3,
      maxLength: 75,
      pattern: `^[A-Za-z0-9;:.', ()-]+$`,
    },
    providerAddress: addressNoMilitarySchema({
      extend: {
        street: {
          minLength: addressSpecifications.street.minLength,
          maxLength: addressSpecifications.street.maxLength,
        },
        street2: { maxLength: addressSpecifications.street2.maxLength },
        street3: { maxLength: addressSpecifications.street3.maxLength },
        city: {
          minLength: addressSpecifications.city.minLength,
          maxLength: addressSpecifications.city.maxLength,
        },
        postalCode: {
          minLength: addressSpecifications.postalCode.minLength,
          maxLength: addressSpecifications.postalCode.maxLength,
        },
      },
    }),
  },
};

export { schema, uiSchema };
