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
        // description, // TODO: Fix description for yesNoUI
        // https://app.zenhub.com/workspaces/accredited-representative-facing-team-65453a97a9cc36069a2ad1d6/issues/gh/department-of-veterans-affairs/va.gov-team/87152
      }),
      [`view:${key}Description`]: {
        'ui:description': description,
      },
    },
    schema: {
      type: 'object',
      properties: {
        [key]: yesNoSchema,
        [`view:${key}Description`]: {
          type: 'object',
          properties: {},
        },
      },
      required: [key],
    },
  };
};

export default yesNoPageSchema;
