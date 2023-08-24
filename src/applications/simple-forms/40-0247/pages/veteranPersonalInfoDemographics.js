import React from 'react';

import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';

import { DEMOGRAPHICS_ITEMS } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': <h3>What is the Veteran’s race, ethnicity, or origin?</h3>,
    'ui:description': (
      <p>
        (Please check all that apply)
        <br />
        Information is gathered for statistical purposes only.
      </p>
    ),
    veteranDemographics: {
      'ui:title': 'Race, ethnicity, or origin',
      'ui:widget': GroupCheckboxWidget,
      'ui:options': {
        // TODO: Normalize data w/ submit-transformer, as
        // one value has commas in it.
        labels: Object.values(DEMOGRAPHICS_ITEMS),
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
