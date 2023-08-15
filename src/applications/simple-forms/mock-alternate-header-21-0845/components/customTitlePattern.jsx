import React from 'react';

/**
 * To be used with custom header which expects a h1 title defined by the page
 *
 * @param {string | JSX.Element} [title] 'ui:title'
 * @param {string | JSX.Element} [description] 'ui:description'
 *
 * @returns {UISchemaOptions}
 */
export const titleH1UI = (title, description) => {
  return {
    'ui:title': (
      <h1 className="vads-u-color--gray-dark vads-u-font-size--h3 medium-screen:vads-u-font-size--h1 vads-u-margin-y--0">
        {title}
      </h1>
    ),
    'ui:description': description ? (
      <p className="vads-u-margin-bottom--0">{description}</p>
    ) : null,
  };
};

/**
 * @returns {SchemaOptions}
 */
export const titleH1Schema = {
  type: 'object',
  properties: {},
};
