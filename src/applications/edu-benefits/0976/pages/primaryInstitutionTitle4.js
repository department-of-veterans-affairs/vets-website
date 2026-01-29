// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Institution details'),
    institutionProfile: {
      participatesInTitleIV: yesNoUI({
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
            formData.institutionProfile?.participatesInTitleIV === true,
        }),
        'ui:options': {
          expandUnder: 'participatesInTitleIV',
          expandUnderCondition: true,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      institutionProfile: {
        type: 'object',
        properties: {
          participatesInTitleIV: yesNoSchema,
          opeidNumber: {
            ...textSchema,
            maxLength: 500,
          },
        },
        required: ['participatesInTitleIV'],
      },
    },
  },
};
