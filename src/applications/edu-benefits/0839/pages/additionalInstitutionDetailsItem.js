import React from 'react';
import {
  addressSchema,
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AdditionalInstitutionName from '../containers/AdditionalInstitutionName';
import AdditionalInstitutionAddress from '../containers/AdditionalInstitutionAddress';
import WarningBanner from '../containers/WarningBanner';
import { facilityCodeUIValidation } from '../helpers';

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
      useAllFormData: true,
      data: {
        'facility-field': 'additional-facility-code',
      },
    }),
    'ui:validations': [facilityCodeUIValidation],
  },
  institutionName: {
    'ui:title': 'Institution name and address',
    'ui:field': AdditionalInstitutionName,
    'ui:options': {
      classNames: 'vads-u-margin-top--2',
      dataPath: 'additionalInstitutionDetails',
      isArrayItem: true,
    },
  },
  institutionAddress: {
    'ui:title': '',
    'ui:field': AdditionalInstitutionAddress,
    'ui:options': {
      classNames: 'vads-u-margin-top--2',
      hideLabelText: true,
      updateSchema: (formData, currentSchema, _uiSchema, index) => {
        const isForeign = !!formData?.additionalInstitutionDetails?.[index]
          ?.isForeignCountry;

        if (!isForeign) {
          // Leave schema exactly as-is for domestic cases
          return currentSchema;
        }

        // Foreign: make country free-text; state & postalCode NOT required
        const withoutStateAndPostal = (currentSchema?.required || []).filter(
          k => k !== 'state' && k !== 'postalCode',
        );

        return {
          ...currentSchema,
          properties: {
            ...currentSchema?.properties,
            country: { type: 'string', minLength: 1, title: 'Country' },
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
