import React from 'react';
import {
  addressSchema,
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import InstitutionName from '../components/InstitutionName';
import InstitutionAddress from '../components/InstitutionAddress';

const facilityCodeUIValidation = (errors, fieldData, formData) => {
  const details = formData?.institutionDetails || {};
  const code = (fieldData || '').trim();

  const badFormat = code.length > 0 && !/^[a-zA-Z0-9]{8}$/.test(code);
  const notFound = details.institutionName === 'not found';
  const notIHL = details.ihlEligible === false;

  if (badFormat || notFound) {
    errors.addError(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
  }
  if (notIHL) {
    errors.addError(
      'This institution is not an IHL. Please see information below.',
    );
  }
};

const uiSchema = {
  ...titleUI("Please enter your institution's facility code"),
  'view:additionalInstructions': {
    'ui:description': (
      <va-link
        text="Review additional instructions for the Yellow Ribbon Program Agreement"
        href="/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/yellow-ribbon-instructions"
        external
      />
    ),
  },
  facilityCode: {
    ...textUI({
      title: 'Facility code',
      hint: '',
      errorMessages: {
        required:
          'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
      },
    }),
    'ui:validations': [facilityCodeUIValidation],
  },
  institutionName: {
    'ui:title': 'Institution name and address',
    'ui:field': InstitutionName,
    'ui:options': {
      classNames: 'vads-u-margin-top--2',
    },
  },
  institutionAddress: {
    'ui:title': '',
    'ui:field': InstitutionAddress,
    'ui:options': {
      classNames: 'vads-u-margin-top--2',
      hideLabelText: true,
    },
  },
  'view:warningBanner': {
    'ui:description': formData => {
      const notIHL = formData?.institutionDetails?.ihlEligible === false;
      if (notIHL) {
        return (
          <va-alert
            status="warning"
            visible
            headline="This institution is unable to participate in the Yellow Ribbon Program."
          />
        );
      }
      return null;
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    'view:additionalInstructions': {
      type: 'object',
      properties: {},
    },
    facilityCode: textSchema,
    institutionName: {
      type: 'string',
    },
    institutionAddress: {
      type: 'object',
      properties: {
        country: addressSchema().properties.country,
        street: addressSchema().properties.street,
        street2: {
          ...addressSchema().properties.street2,
          minLength: 0,
        },
        street3: {
          ...addressSchema().properties.street3,
          minLength: 0,
        },
        city: addressSchema().properties.city,
        state: addressSchema().properties.state,
        postalCode: addressSchema().properties.postalCode,
      },
      required: ['street', 'city', 'state', 'postalCode', 'country'],
    },
    'view:warningBanner': {
      type: 'object',
      properties: {},
    },
  },
  required: ['facilityCode'],
};

export { uiSchema, schema };
