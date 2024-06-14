import {
  descriptionUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Your character references',
  path: 'your-character-references',
  uiSchema: {
    ...titleUI('Your character references'),
    ...descriptionUI(
      'Over the next couple of pages, we’ll ask you to provide the names and contact information of three individuals, who are not immediate family members, who have personal knowledge of your character and qualifications to serve as an attorney or claims agent.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
