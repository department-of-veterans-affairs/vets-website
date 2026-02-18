import React from 'react';
import {
  titleUI,
  textUI,
  textSchema,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import InstitutionName from '../containers/InstitutionName';
import InstitutionAddress from '../containers/InstitutionAddress';
import WarningBanner from '../containers/WarningBanner';

const facilityCodeUIValidation = (errors, fieldData, formData) => {
  const code = (fieldData || '').trim();
  const details = formData?.institutionDetails || {};
  const isLoading = details?.isLoading;

  if (isLoading) {
    return;
  }

  const badFormat = fieldData && !/^[a-zA-Z0-9]{8}$/.test(fieldData);
  const notFound = details.institutionName === 'not found';
  const notYR = details.yrEligible === false;
  const hasXInThirdPosition =
    code.length === 8 && !badFormat && code.charAt(2).toUpperCase() === 'X';

  // TODO: move below 'not found' check after new response code is configured
  if (hasXInThirdPosition) {
    errors.addError('Codes with an "X" in the third position are not eligible');
    return;
  }

  if (badFormat || notFound) {
    errors.addError(
      'Please enter a valid facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
  }

  if (notYR) {
    errors.addError(
      "The institution isn't eligible for the Yellow Ribbon Program.",
    );
  }
};

const uiSchema = {
  institutionDetails: {
    ...titleUI("Please enter your institution's facility code"),
    'view:additionalInstructions': {
      'ui:options': {
        hideIf: formData =>
          formData?.agreementType === 'withdrawFromYellowRibbonProgram',
      },
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

        updateSchema: (formData, currentSchema) => {
          const isForeign = !!formData?.institutionDetails?.isForeignCountry;

          if (!isForeign) {
            // Leave schema exactly as-is for non-foreign cases
            return currentSchema;
          }

          // Foreign: free-text country; state & postalCode NOT required
          const withoutStateAndPostal = (currentSchema?.required || []).filter(
            key => key !== 'state' && key !== 'postalCode',
          );

          return {
            ...currentSchema,
            properties: {
              ...currentSchema?.properties,
              country: { type: 'string', minLength: 1 },
            },
            required: withoutStateAndPostal.length
              ? withoutStateAndPostal
              : ['street', 'city', 'country'],
          };
        },
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
            country: addressSchema().properties.country,
            street: addressSchema().properties.street,
            street2: { ...addressSchema().properties.street2, minLength: 0 },
            street3: { ...addressSchema().properties.street3, minLength: 0 },
            city: addressSchema().properties.city,
            state: addressSchema().properties.state,
            postalCode: addressSchema().properties.postalCode,
          },
          required: ['street', 'city', 'state', 'postalCode', 'country'],
        },
        'view:warningBanner': { type: 'object', properties: {} },
      },
      required: ['facilityCode'],
    },
  },
};

export { uiSchema, schema };
