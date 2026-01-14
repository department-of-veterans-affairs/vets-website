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
        title:
          'Does the facility participate in a program under Title IV with the U.S. Department of Education?',
      }),
      opeidNumber: {
        ...textUI({
          title: 'List your institution’s OPEID number below',
          errorMessages: {
            required: 'You must enter your institution’s OPEID number below',
          },
          required: formData =>
            formData.institutionProfile?.participatesInTitleIV === false,
        }),
        'ui:options': {
          expandUnder: 'participatesInTitleIV',
          expandUnderCondition: false,
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
