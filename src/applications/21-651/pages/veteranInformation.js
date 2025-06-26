// @ts-check
import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  ssnSchema,
  ssnUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran information'),
    veteranFullName: fullNameNoSuffixUI(),
    vaFileNumber: textUI({
      title: 'VA file number',
      hint:
        'This is the 8- or 9-digit number for your claim. You can find this number on letters and forms from VA.',
    }),
    serviceNumber: textUI({
      title: 'Service number (if applicable)',
      hint:
        'This is the number assigned to you when you entered military service. You can find this on your DD214.',
    }),
    socialSecurityNumber: ssnUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      vaFileNumber: textSchema,
      serviceNumber: textSchema,
      socialSecurityNumber: ssnSchema,
    },
    required: ['veteranFullName', 'vaFileNumber', 'socialSecurityNumber'],
  },
};
