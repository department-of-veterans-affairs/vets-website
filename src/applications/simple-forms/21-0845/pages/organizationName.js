import React from 'react';

/** @type {PageSchema} */
export default {
  uiSchema: {
    organizationName: {
      'ui:title': <h3 style={{ display: 'inline' }}>Organization’s name</h3>,
      'ui:reviewField': ({ children }) => (
        // prevent ui:title's <h3> from getting pulled into
        // review-field's <dt> & causing a11y headers-hierarchy errors.
        <div className="review-row">
          <dt>Name of organization</dt>
          <dd>{children}</dd>
        </div>
      ),
      'ui:errorMessages': {
        required: 'Please enter the name of the organization',
      },
      'ui:options': {
        widgetClassNames: 'vads-u-margin-top--3',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['organizationName'],
    properties: {
      organizationName: {
        type: 'string',
      },
    },
  },
};
