import {
  titleUI,
  ssnUI,
  ssnSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

export const identification = {
  uiSchema: {
    ...titleUI({
      title: "Child's identification information",
    }),
    ssn: {
      ...ssnUI('Child’s Social Security number'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      ssn: ssnSchema,
    },
  },
};
