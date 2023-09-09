import React from 'react';

import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <>
        <h3>What is the Veteran’s race, ethnicity, or origin?</h3>
        <p className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
          (Please check all that apply)
          <br />
          Information is gathered for statistical purposes only.
        </p>
      </>
    ),
    veteranDemographics: {
      'ui:title': 'Race, ethnicity, or origin',
      'ui:widget': GroupCheckboxWidget,
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
