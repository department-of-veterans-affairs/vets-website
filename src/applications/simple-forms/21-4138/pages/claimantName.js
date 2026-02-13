import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const claimantNamePage = {
  uiSchema: {
    ...titleUI({ title: 'Your name', headerLevel: 1 }),
    fullName: fullNameNoSuffixUI(),
  },
  schema: {
    type: 'object',
    required: ['fullName'],
    properties: {
      fullName: fullNameNoSuffixSchema,
    },
  },
};

