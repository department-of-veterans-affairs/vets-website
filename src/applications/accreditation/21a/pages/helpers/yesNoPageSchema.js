import camelCase from 'lodash/camelCase';

import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const yesNoPageSchema = ({ title, path, depends, question, description }) => {
  const key = camelCase(path);

  return {
    title,
    path,
    depends,
    uiSchema: {
      [key]: yesNoUI({
        title: question,
        labelHeaderLevel: '3',
        description, // TODO: Fix description for yesNoUI
      }),
    },
    schema: {
      type: 'object',
      properties: {
        [key]: yesNoSchema,
      },
      required: [key],
    },
  };
};

export default yesNoPageSchema;
