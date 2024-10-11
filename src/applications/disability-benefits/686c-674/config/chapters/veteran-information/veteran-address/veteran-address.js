import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
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

// add international phone field
merge(veteranContactInformationSchema.properties, {
  internationalPhoneNumber: {
    type: 'string',
    pattern: '^\\+?[0-9](?:-?[0-9]){6,14}$',
  },
  electronicCorrespondence: {
    type: 'boolean',
  },
});

export const schema = {
  type: 'object',
  properties: {
    veteranContactInformation: veteranContactInformationSchema,
  },
};

export const uiSchema = {
  veteranContactInformation: {
    'ui:order': [
      'veteranAddress',
      'phoneNumber',
      'internationalPhoneNumber',
      'emailAddress',
      'electronicCorrespondence',
    ],
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
            pattern: '[0-9]{3}-?[0-9]{3}-?[0-9]{4}$',
          };
        },
      },
      'ui:errorMessages': {
        pattern: 'Enter a 10-digit phone number without dashes or spaces',
        minLength: 'Enter a 10-digit phone number without dashes or spaces',
        required: 'Enter a phone number',
      },
    },
    internationalPhoneNumber: {
      'ui:title': 'International phone number',
      'ui:errorMessages': {
        required:
          'Please enter an international phone number (with or without dashes)',
        pattern:
          'Please enter a valid international phone number (with or without dashes)',
      },
    },
    emailAddress: emailUI(),
    electronicCorrespondence: {
      'ui:title':
        'I agree to receive electronic correspondence from VA in regards to my claim.',
    },
  },
};

export const updateFormData = (oldFormData, formData) =>
  updateFormDataAddress(oldFormData, formData, [
    'veteranContactInformation',
    'veteranAddress',
  ]);
