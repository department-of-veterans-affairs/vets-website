import React from 'react';

/**
 * @param {string | import("react").JSXElementConstructor} [title]
 * @param {UIOptions} [uiOptions]
 *
 * @returns {JSXElementConstructor}
 */
export const titleUI = (title, uiOptions) => {
  return {
    'ui:title': (
      <h3 className="vads-u-color--gray-dark vads-u-margin-y--0">{title}</h3>
    ),
    'ui:options': {
      ...uiOptions,
    },
  };
};

const schema = {
  type: 'object',
  properties: {},
};

/**
 * @returns {SchemaOptions}
 */
export const titleSchema = () => {
  return schema;
};
