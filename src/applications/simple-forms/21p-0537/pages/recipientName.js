import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Deceased veteran information'),
    'ui:description':
      'Tell us about the veteran whose DIC benefits you receive. We need this information to locate their records and process your marital status update.',
    veteranFullName: fullNameNoSuffixUI(title => `Deceased veteran's ${title}`),
  },
  schema: {
    type: 'object',
    required: ['veteranFullName'],
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
    },
  },
};
