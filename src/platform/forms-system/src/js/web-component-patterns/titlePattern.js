import React from 'react';

/**
 * @param {string | import("react").JSXElementConstructor} [title]
 * @param {UIOptions} [uiOptions]
 *
 * @returns {JSX.Element}
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

/**
 * @returns {SchemaOptions}
 */
export const titleSchema = {
  type: 'object',
  properties: {},
};
