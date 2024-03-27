import {
  titleUI,
  vaFileNumberUI,
  vaFileNumberSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your VA claim information',
      'Here is some helpful information about what and why we are collecting on this page.',
    ),
    vaClaimsHistory: yesNoUI({
      title: 'Have you ever filed a claim with VA?',
      classNames: 'vads-u-margin-bottom--2',
    }),
    vaFileNumber: {
      ...vaFileNumberUI(),
      'ui:options': {
        hint: 'Enter your VA file number if it doesn’t match your SSN',
      },
    },
  },
  schema: {
    type: 'object',
    required: [''],
    properties: {
      vaClaimsHistory: yesNoSchema,
      vaFileNumber: vaFileNumberSchema,
    },
  },
};
