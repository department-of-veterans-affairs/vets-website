import cloneDeep from 'lodash/cloneDeep';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { textUI } from 'platform/forms-system/src/js/web-component-patterns/textPatterns.jsx';
import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns/fullNamePattern';
import {
  ssnSchema,
  ssnUI,
} from 'platform/forms-system/src/js/web-component-patterns/ssnPattern.jsx';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns/datePatterns.jsx';

const { phoneAndEmail } = fullSchema.properties;

const createVeteranInformationSchema = () => ({
  type: 'object',
  required: ['veteranFullName', 'veteranDateOfBirth'],
  properties: {
    veteranFullName: fullNameNoSuffixSchema,
    veteranSocialSecurityNumber: ssnSchema,
    veteranDateOfBirth: dateOfBirthSchema,
  },
});

const createVeteranInformationUiSchema = () => ({
  'ui:title': 'Veteran information',
  veteranFullName: fullNameNoSuffixUI(title => `Veteran's ${title.toLowerCase()}`),
  veteranSocialSecurityNumber: {
    ...ssnUI("Veteran's Social Security number"),
    'ui:options': {
      uswds: true,
    },
  },
  veteranDateOfBirth: dateOfBirthUI("Veteran's date of birth"),
});

const createMailingAddressSchema = () => {
  const mailingAddress = cloneDeep(fullSchema.definitions.address);
  mailingAddress.required = mailingAddress.required || [
    'country',
    'addressLine1',
    'city',
    'zipCode',
  ];

  // Inline referenced definitions so the schema can resolve without requiring
  // a global definitions map at runtime.
  mailingAddress.properties = {
    ...mailingAddress.properties,
    country: cloneDeep(fullSchema.definitions.country),
    state: cloneDeep(fullSchema.definitions.state),
  };

  return mailingAddress;
};

const createPhoneAndEmailSchema = () => ({
  type: 'object',
  required: ['emailAddress'],
  properties: {
    primaryPhone: cloneDeep(fullSchema.definitions.nonRequiredPhone),
    emailAddress: cloneDeep(fullSchema.definitions.email),
  },
});

const mailingAddressUiSchema = {
  'ui:title': 'Mailing address',
  'ui:order': [
    'country',
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'state',
    'zipCode',
  ],
  country: {
    'ui:title': 'Country',
    'ui:autocomplete': 'country',
  },
  addressLine1: textUI({
    title: 'Street address',
    autocomplete: 'address-line1',
    errorMessages: {
      required: 'Enter a street address',
    },
  }),
  addressLine2: textUI({
    title: 'Street address line 2',
    autocomplete: 'address-line2',
    errorMessages: {
      pattern: 'Enter a valid street address',
    },
  }),
  addressLine3: textUI({
    title: 'Street address line 3',
    autocomplete: 'address-line3',
    errorMessages: {
      pattern: 'Enter a valid street address',
    },
  }),
  city: textUI({
    title: 'City',
    autocomplete: 'address-level2',
    errorMessages: {
      required: 'Enter a city',
      pattern: 'Enter a valid city',
    },
  }),
  state: {
    'ui:title': 'State or province',
    'ui:autocomplete': 'address-level1',
    'ui:required': formData => formData?.country === 'USA',
    'ui:errorMessages': {
      required: 'Enter a state or province',
    },
    'ui:options': {
      hideIf: formData => formData?.country && formData.country !== 'USA',
      widgetClassNames: 'va-input-medium-large',
    },
  },
  zipCode: textUI({
    title: 'Postal code',
    autocomplete: 'postal-code',
    errorMessages: {
      pattern: 'Enter a valid postal code',
    },
    required: formData => formData?.country === 'USA',
    hideIf: formData => formData?.country && formData.country !== 'USA',
    widgetClassNames: 'va-input-medium-large',
  }),
};

const contactInformationUiSchema = {
  'ui:title': 'Contact information',
  phoneAndEmail: {
    'ui:title': 'Phone and email',
    primaryPhone: phoneUI('Primary phone number'),
    emailAddress: emailUI('Email address'),
  },
  mailingAddress: mailingAddressUiSchema,
};

const createContactInformationSchema = () => ({
  type: 'object',
  properties: {
    phoneAndEmail: createPhoneAndEmailSchema(),
    mailingAddress: createMailingAddressSchema(),
  },
});

export const buildVeteranInformationSection = () => ({
  schema: createVeteranInformationSchema(),
  uiSchema: createVeteranInformationUiSchema(),
});

export const buildContactInformationSection = () => ({
  schema: createContactInformationSchema(),
  uiSchema: contactInformationUiSchema,
});
