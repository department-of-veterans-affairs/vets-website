import {
  addressSchema,
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import InstitutionName from '../components/InstitutionName';
import InstitutionAddress from '../components/InstitutionAddress';
// import WarningBanner from '../containers/WarningBanner';

const facilityCodeUIValidation = (errors, fieldData, formData) => {
  const details = formData?.institutionDetails || {};
  const badFormat = fieldData && !/^[a-zA-Z0-9]{8}$/.test(fieldData);
  const notFound = details.institutionName === 'not found';
  const ineligible = details.poeEligible === false;

  if (badFormat || notFound) {
    errors.addError(
      'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
    );
  }
  if (ineligible) {
    errors.addError(
      'This institution is unable to participate in the Principles of Excellence.',
    );
  }
};

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
  //   'view:warningBanner': {
  //     'ui:field': WarningBanner,
  //     'ui:options': {
  //       dataPath: 'additionalInstitutionDetails',
  //       isArrayItem: true,
  //     },
  //   },
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
    // 'view:warningBanner': {
    //   type: 'object',
    //   properties: {},
    // },
  },
  required: ['facilityCode'],
};

export { uiSchema, schema };
