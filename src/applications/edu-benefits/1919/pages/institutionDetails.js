import {
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import InstitutionName from '../components/InstitutionName';
import InstituionAddress from '../components/InstituionAddress';

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
          if (
            (fieldData && !/^[a-zA-Z0-9]{8}$/.test(fieldData)) ||
            institutionName === 'not found'
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
    instituionAddress: {
      'ui:title': ' ',
      'ui:field': InstituionAddress,
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
        instituionAddress: {
          type: 'string',
        },
      },
    },
  },
};
export { schema, uiSchema };
