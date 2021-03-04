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

// add confirm email field on the frontend only
veteranContactInformationSchema.properties['view:confirmEmail'] = {
  type: 'string',
};

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
      'ui:required': () => true,
      'ui:title': 'Phone Number',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        updateSchema: () => {
          return {
            type: 'string',
            pattern: '^\\d{10}$',
          };
        },
      },
      'ui:errorMessages': {
        pattern:
          'Please enter a 10-digit phone number without dashes or spaces',
        minLength:
          'Please enter a 10-digit phone number without dashes or spaces',
        required: 'Please enter a phone number',
      },
    },
    emailAddress: emailUI(),
    'view:confirmEmail': {
      'ui:required': formData =>
        formData.veteranContactInformation.emailAddress !== undefined,
      'ui:validations': [
        (errors, fieldData, formData) => {
          if (
            formData?.veteranContactInformation?.emailAddress !==
            formData?.veteranContactInformation?.['view:confirmEmail']
          ) {
            errors.addError('Please ensure your emails match');
          }
        },
      ],
      'ui:title': 'Confirm email address',
      'ui:options': {
        expandUnder: 'emailAddress',
        expandUnderCondition: emailAddress => {
          return emailAddress;
        },
      },
    },
  },
};
