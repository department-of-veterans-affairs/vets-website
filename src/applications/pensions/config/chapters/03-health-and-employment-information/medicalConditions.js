import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import {
  MedicalConditionAdditionalInfo,
  hasNoSocialSecurityDisability,
} from './helpers';

const { medicalCondition } = fullSchemaPensions.properties;
/** @type {PageSchema} */
export default {
  title: 'Medical condition',
  path: 'medical/history/condition',
  depends: form => hasNoSocialSecurityDisability(form),
  uiSchema: {
    ...titleUI('Medical conditions '),
    medicalCondition: yesNoUI({
      title: 'Do you have a medical condition that prevents you from working?',
      hint: `A medical condition is an illness or injury that affects your mind or body. It doesn't have to be service connected.`,
      classNames: 'vads-u-margin-bottom--2',
    }),
    'view:AdditionalInformation': {
      'ui:description': MedicalConditionAdditionalInfo,
    },
  },
  schema: {
    type: 'object',
    required: ['medicalCondition'],
    properties: {
      medicalCondition,
      'view:AdditionalInformation': {
        type: 'object',
        properties: {},
      },
    },
  },
};
