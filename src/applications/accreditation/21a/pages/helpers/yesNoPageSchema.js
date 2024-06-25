import React from 'react';
import camelCase from 'lodash/camelCase';

import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const yesNoPageSchema = ({
  title,
  path,
  depends,
  heading,
  descriptionString = '',
  DescriptionComponent,
  options,
}) => {
  const description = DescriptionComponent ? (
    <div className="yesNoDescription">
      <DescriptionComponent />
    </div>
  ) : (
    <div className="yesNoDescription">{descriptionString}</div>
  );
  const key = camelCase(path);

  return {
    title,
    path,
    depends,
    uiSchema: {
      ...titleUI(heading, description),
      [key]: yesNoUI(options || ' '),
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
