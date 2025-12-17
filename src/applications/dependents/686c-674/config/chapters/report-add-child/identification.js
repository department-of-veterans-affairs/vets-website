import {
  titleUI,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const identification = {
  uiSchema: {
    ...titleUI({
      title: 'Child’s identification information',
    }),
    ssn: {
      ...ssnUI('Child’s Social Security number'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    required: ['ssn'],
    properties: {
      ssn: ssnSchema,
    },
  },
};
