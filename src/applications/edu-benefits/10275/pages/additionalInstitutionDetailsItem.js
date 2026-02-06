import {
  addressSchema,
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AdditionalInstitutionAddress from '../containers/AdditionalInstitutionAddress';
import AdditionalInstitutionName from '../containers/AdditionalInstitutionName';
import { facilityCodeUIValidation } from '../helpers';

const uiSchema = {
  ...arrayBuilderItemFirstPageTitleUI({
    title:
      "Enter the VA facility code for the additional location you'd like to add",
    nounSingular: 'institution',
  }),
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
      dataPath: 'additionalLocations',
      isArrayItem: true,
    },
  },
  institutionAddress: {
    'ui:title': '',
    'ui:field': AdditionalInstitutionAddress,
    'ui:options': {
      classNames: 'vads-u-margin-top--2',
      hideLabelText: true,
      dataPath: 'additionalLocations',
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
        country: { type: 'string' },
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
  },
  required: ['facilityCode'],
};

export { uiSchema, schema };
