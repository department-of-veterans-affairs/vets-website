import React from 'react';
import {
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import InstitutionName from '../containers/InstitutionName';
import InstitutionAddress from '../containers/InstitutionAddress';
import WarningBanner from '../containers/WarningBanner';

const facilityCodeUIValidation = (errors, fieldData, formData) => {
  const details = formData?.institutionDetails || {};
  const code = (fieldData || '').trim();
  const isLoading = details?.isLoading;

  // Don't show validation errors while loading
  if (isLoading) {
    return;
  }

  const badFormat = code.length > 0 && !/^[a-zA-Z0-9]{8}$/.test(code);
  const notFound = details.institutionName === 'not found';
  const notIHL = details.ihlEligible === false;
  const notYR = details.yrEligible === false;

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
};

const uiSchema = {
  institutionDetails: {
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
        dataPath: 'institutionDetails',
        isArrayItem: false,
      },
    },
    institutionAddress: {
      'ui:title': '',
      'ui:field': InstitutionAddress,
      'ui:options': {
        classNames: 'vads-u-margin-top--2',
        hideLabelText: true,
        dataPath: 'institutionDetails',
        isArrayItem: false,
      },
    },
    'view:warningBanner': {
      'ui:field': WarningBanner,
      'ui:options': {
        dataPath: 'institutionDetails',
        isArrayItem: false,
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    institutionDetails: {
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
            country: { type: 'string' },
            street: { type: 'string' },
            street2: { type: 'string' },
            street3: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            postalCode: { type: 'string' },
          },
          anyOf: [
            {
              // For USA addresses
              properties: {
                country: { const: 'USA' },
              },
              required: ['street', 'city', 'state', 'postalCode', 'country'],
            },
            {
              // For international addresses
              properties: {
                country: { not: { const: 'USA' } },
              },
              required: ['street', 'city', 'country'],
            },
          ],
        },
        'view:warningBanner': {
          type: 'object',
          properties: {},
        },
      },
      required: ['facilityCode'],
    },
  },
};

export { uiSchema, schema };
