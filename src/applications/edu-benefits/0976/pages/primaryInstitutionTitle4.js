// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateWhiteSpace } from 'platform/forms/validations';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Institution details'),
    institutionProfile: {
      participatesInTitleIv: yesNoUI({
        yesNoReverse: true,
        title:
          'Does the facility participate in a program under Title IV with the U.S. Department of Education?',
        labels: {
          N: 'Yes',
          Y: 'No',
        },
      }),
      opeidNumber: {
        ...textUI({
          title: 'List your institution’s OPEID number below',
          errorMessages: {
            required: 'You must enter your institution’s OPEID number below',
          },
          required: formData =>
            formData.institutionProfile?.participatesInTitleIv === true,
        }),
        'ui:options': {
          expandUnder: 'participatesInTitleIv',
          expandUnderCondition: true,
        },
        'ui:validations': [
          validateWhiteSpace,
          (errors, fieldData, _formData) => {
            if (fieldData && !/^[\w\s]*$/.test(fieldData)) {
              errors.addError('No special characters allowed');
            }
          },
        ],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      institutionProfile: {
        type: 'object',
        properties: {
          participatesInTitleIv: yesNoSchema,
          opeidNumber: {
            ...textSchema,
            maxLength: 500,
          },
        },
        required: ['participatesInTitleIv'],
      },
    },
  },
};
