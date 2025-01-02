import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export const intro = {
  uiSchema: {
    ...titleUI({
      title: 'Your children',
      description:
        'In the next few questions, we’ll ask you about your children. You must add at least one child.',
    }),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
