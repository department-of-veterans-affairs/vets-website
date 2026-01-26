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
      isIhl: yesNoUI({
        title:
          'Does your country’s governing authority, with oversight over educational institutions and programs, officially classify the facility as a institution of higher learning?',
      }),
      ihlDegreeTypes: {
        ...textUI({
          title: 'Enter degree type(s)',
          errorMessages: {
            required: 'You must enter a degree type',
          },
          required: formData => formData.institutionProfile?.isIhl === false,
        }),
        'ui:options': {
          expandUnder: 'isIhl',
          expandUnderCondition: false,
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
          isIhl: yesNoSchema,
          ihlDegreeTypes: {
            ...textSchema,
            maxLength: 500,
          },
        },
        required: ['isIhl'],
      },
    },
  },
};
