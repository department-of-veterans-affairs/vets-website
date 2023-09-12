import React from 'react';

import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranDemographics: {
      'ui:title': (
        <>
          <p className="custom-label vads-u-margin-top--0">
            What is the Veteran’s race, ethnicity, or origin?
          </p>
          <p className="custom-description">(Please check all that apply.)</p>
          <p className="custom-description">
            Information is gathered for statistical purposes only.
          </p>
        </>
      ),
      'ui:widget': GroupCheckboxWidget,
      'ui:reviewField': ({ children }) => (
        <div className="review-row">
          <dt>Race, ethnicity, or origin</dt>
          <dd>{children}</dd>
        </div>
      ),
      'ui:options': {
        // TODO: Normalize data w/ submit-transformer, as
        // one value has commas in it.
        labels: [
          'American Indian or Alaskan Native',
          'Asian',
          'Black or African American',
          'Hispanic, Latino, or Spanish',
          'Native Hawaiian or Other Pacific Islander',
          'White',
          'Prefer not to answer',
        ],
        forceDivWrapper: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranDemographics: {
        type: 'string',
      },
    },
  },
};
