import cloneDeep from 'platform/utilities/data/cloneDeep';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { veteranInformation } from '../../../utilities';
import {
  buildAddressSchema,
  addressUISchema,
  updateFormDataAddress,
} from '../../../address-schema';

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
        pattern: 'Enter a 10-digit phone number without dashes or spaces',
        minLength: 'Enter a 10-digit phone number without dashes or spaces',
        required: 'Enter a phone number',
      },
    },
    emailAddress: emailUI(),
    'view:confirmEmail': {
      'ui:required': formData =>
        formData.veteranContactInformation.emailAddress !== undefined,
      'ui:validations': [
        (errors, fieldData, formData) => {
          if (
            formData?.veteranContactInformation?.emailAddress.toLowerCase() !==
            formData?.veteranContactInformation?.[
              'view:confirmEmail'
            ].toLowerCase()
          ) {
            errors.addError('Ensure your emails match');
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

export const updateFormData = (oldFormData, formData) =>
  updateFormDataAddress(oldFormData, formData, [
    'veteranContactInformation',
    'veteranAddress',
  ]);
