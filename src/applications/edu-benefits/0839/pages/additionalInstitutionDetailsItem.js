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
  // In array builder item pages, formData is scoped to the current item
  const code = (fieldData || '').trim();

  const mainInstitution = formData?.institutionDetails;

  const badFormat = code?.length > 0 && !/^[a-zA-Z0-9]{8}$/.test(code);
  const notFound = formData?.institutionName === 'not found';
  const notIHL = formData?.ihlEligible === false;
  const notYR = formData?.yrEligible === false;
  const thirdChar = code?.charAt(2).toUpperCase();

  const hasXInThirdPosition =
    code.length === 8 && !badFormat && thirdChar === 'X';

  if (badFormat || notFound) {
    errors.addError(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
  }

  if (hasXInThirdPosition) {
    errors.addError('Codes with an “X” in the third position are not eligible');
  }

  if (
    !mainInstitution?.facilityMap?.branches?.includes(code) ||
    !mainInstitution?.facilityMap?.extensions?.includes(code)
  ) {
    errors.addError(
      'This facility code isn’t linked to your school’s main campus',
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
      dataPath: 'additionalInstitutionDetails',
      isArrayItem: true,
    },
  },
  institutionAddress: {
    'ui:title': '',
    'ui:field': InstitutionAddress,
    'ui:options': {
      classNames: 'vads-u-margin-top--2',
      hideLabelText: true,
      dataPath: 'additionalInstitutionDetails',
      isArrayItem: true,
    },
  },
  'view:warningBanner': {
    'ui:field': WarningBanner,
    'ui:options': {
      dataPath: 'additionalInstitutionDetails',
      isArrayItem: true,
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
