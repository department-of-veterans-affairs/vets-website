import React from 'react';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <>
        <h3>Select the Veteran’s gender identity</h3>
        <p className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
          Information is gathered for statistical purposes only.
        </p>
      </>
    ),
    veteranGenderIdentity: {
      'ui:title': 'Gender identity',
      'ui:widget': 'radio',
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
