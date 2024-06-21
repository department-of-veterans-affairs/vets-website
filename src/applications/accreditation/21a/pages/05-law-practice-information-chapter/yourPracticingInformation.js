import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Your practicing information',
  path: 'your-practicing-information',
  uiSchema: {
    ...titleUI(
      'Your practicing information',
      'Over the next couple of pages, we will ask you to provide information about your standing with the courts and the agencies where you practiced.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
