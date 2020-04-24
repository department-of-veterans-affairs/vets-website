import cloneDeep from 'platform/utilities/data/cloneDeep';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { veteranInformation } from '../../../utilities';
import { buildAddressSchema, addressUISchema } from '../../../address-schema';

const veteranContactInformationSchema = cloneDeep(
  veteranInformation.properties.veteranAddress,
);

veteranContactInformationSchema.properties.veteranAddress = buildAddressSchema(
  true,
);

export const schema = {
  type: 'object',
  properties: {
    veteranContactInformation: veteranContactInformationSchema,
  },
};

export const uiSchema = {
  veteranContactInformation: {
    veteranAddress: addressUISchema(
      true,
      'veteranContactInformation.veteranAddress',
      () => true,
    ),
    phoneNumber: {
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
      'ui:required': () => true,
      'ui:title': 'Phone Number',
      'ui:errorMessages': {
        pattern: 'Please enter only numbers, no dashes or parentheses',
      },
    },
    emailAddress: emailUI(),
  },
};
