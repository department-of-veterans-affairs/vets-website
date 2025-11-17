import {
  addressSchema,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import InstitutionName from '../components/InstitutionName';
import InstitutionAddress from '../components/InstitutionAddress';

const uiSchema = {
  institutionDetails: {
    ...titleUI('Please enter your VA facility code'),
    facilityCode: {
      ...textUI({
        title: 'Facility code',
        errorMessages: {
          required:
            'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
        },
      }),
      'ui:validations': [
        (errors, fieldData, formData) => {
          const institutionName = formData?.institutionDetails?.institutionName;
          const facilityCode = formData?.institutionDetails?.facilityCode;
          if (
            (fieldData && !/^[a-zA-Z0-9]{8}$/.test(fieldData)) ||
            institutionName === 'not found' ||
            facilityCode === ''
          ) {
            errors.addError(
              'Please enter a valid 8-character facility code. To determine your facility code, refer to your WEAMS 22-1998 Report or contact your ELR.',
            );
          }
        },
      ],
    },
    institutionName: {
      'ui:title': 'Institution name and address',
      'ui:field': InstitutionName,
      'ui:options': {
        classNames: 'vads-u-margin-top--2',
      },
    },
    institutionAddress: {
      'ui:title': ' ',
      'ui:field': InstitutionAddress,
      'ui:options': {
        classNames: 'vads-u-margin-top--2',
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    institutionDetails: {
      type: 'object',
      required: ['facilityCode'],
      properties: {
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
    },
  },
};
export { schema, uiSchema };
