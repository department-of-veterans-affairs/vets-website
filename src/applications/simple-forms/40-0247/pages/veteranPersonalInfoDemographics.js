import React from 'react';

import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';

import { DEMOGRAPHICS_ITEMS } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': <h3>What is the Veteran’s race, ethnicity, or origin?</h3>,
    'ui:description': (
      <span>
        (Please check all that apply)
        <br />
        Information is gathered for statistical purposes only.
      </span>
    ),
    veteranDemographics: {
      'ui:title': 'Race, ethnicity, or origin',
      'ui:widget': GroupCheckboxWidget,
      'ui:options': {
        // TODO: Check w/ b/e about splitting string by regex /,(?!\s)/g
        // Options-string should be split only by commas not followed by a space
        // One value has commas inside it: "Hispanic, Latino, or Spanish"
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
