import React from 'react';
import { Link } from 'react-router';

/**
 * For testing purposes.
 * Links for introduction, next page (optional), and review page
 * @param {string} [nextPageUrl] - for example '/introduction'
 * @returns {UISchemaOptions}
 */
export const skipPageUI = (nextPageUrl, uiOptions = {}) => {
  return {
    'ui:title': ' ',
    'ui:field': 'StringField',
    'ui:widget': () => (
      <span>
        <Link className="vads-u-padding-right--2" to="/introduction">
          Introduction page
        </Link>
        {nextPageUrl && (
          <Link className="vads-u-padding-right--2" to={nextPageUrl}>
            Next page
          </Link>
        )}
        <Link to="/review-and-submit">Review page</Link>
      </span>
    ),
    'ui:options': {
      classNames: 'vads-u-margin-top--4',
      ...uiOptions,
    },
  };
};

/**
 * @returns {SchemaOptions}
 */
export const skipPageSchema = () => {
  return {
    type: 'string',
  };
};
