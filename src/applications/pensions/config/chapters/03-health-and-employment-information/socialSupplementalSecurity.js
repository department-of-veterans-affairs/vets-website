import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { socialSecurityDisability } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Social Security or Supplement Security payments',
  path: 'medical/history/social-security-disability',
  depends: formData => !formData.isOver65,
  uiSchema: {
    ...titleUI(
      'Tell us about any Social Security or Supplement Security payments',
    ),
    socialSecurityDisability: yesNoUI({
      title: 'Do you currently receive Social Security disability payments?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['socialSecurityDisability'],
    properties: {
      socialSecurityDisability,
    },
  },
};
