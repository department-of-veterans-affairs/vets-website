import React from 'react';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranGenderIdentity: {
      'ui:title': (
        <>
          <p className="custom-label">Select the Veteran’s gender identity</p>
          <p className="custom-description">
            Information is gathered for statistical purposes only.
          </p>
        </>
      ),
      'ui:widget': 'radio',
      'ui:reviewField': ({ children }) => (
        <div className="review-row">
          <dt />
          <dd>{children}</dd>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranGenderIdentity: {
        type: 'string',
        enum: [
          'Man',
          'Non-binary',
          'Transgender man',
          'Transgender woman',
          'Woman',
          'Prefer not to answer',
          'A gender not listed here',
        ],
      },
    },
  },
};
