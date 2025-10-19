import React from 'react';
import {
  addressSchema,
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import InstitutionName from '../containers/InstitutionName';
import InstitutionAddress from '../containers/InstitutionAddress';
import WarningBanner from '../containers/WarningBanner';

const facilityCodeUIValidation = (errors, fieldData, formData) => {
  const details =
    formData?.additionalInstitutionDetails?.[formData?.currentItemIndex] || {};
  const code = (fieldData || '').trim();

  const badFormat = code.length > 0 && !/^[a-zA-Z0-9]{8}$/.test(code);
  const notFound = details.institutionName === 'not found';
  const notIHL = details.ihlEligible === false;
  const notYR = details.yrEligible === false;

  const thirdChar = code.charAt(2).toUpperCase();

  if (badFormat || notFound) {
    errors.addError(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
  }

  if (notYR) {
    errors.addError(
      "The institution isn't eligible for the Yellow Ribbon Program.",
    );
  }

  if (!notYR && notIHL) {
    errors.addError(
      'This institution is not an IHL. Please see information below.',
    );
  }

  const hasXInThirdPosition =
    code.length === 8 && !badFormat && thirdChar === 'X';

  if (hasXInThirdPosition) {
    errors.addError(
      "This facility code can't be accepted because it's not associated with your main campus. Check your WEAMS 22-1998 Report or contact your ELR for a list of eligible codes.",
    );
  }
};

const uiSchema = {
  ...arrayBuilderItemFirstPageTitleUI({
    title:
      "Enter the VA facility code for the additional location you'd like to add",
    nounSingular: 'institution',
  }),
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
    'ui:field': WarningBanner,
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
      // required: ['street', 'city', 'state', 'postalCode', 'country'], // TODO:
    },
    'view:warningBanner': {
      type: 'object',
      properties: {},
    },
  },
  required: ['facilityCode'],
};

export { uiSchema, schema };
