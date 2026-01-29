import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      'Name of organization’s representatives',
    ),
    ...descriptionUI(
      "Next, we'll ask you for the name of a representative at the organization you entered. The organization may have multiple representatives. You must provide at least 1 representative.",
    ),
  },

  schema: {
    type: 'object',
    properties: {},
  },
};
