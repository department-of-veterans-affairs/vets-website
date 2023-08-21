import React from 'react';

import { THIRD_PARTY_TYPES, RELEASE_DURATIONS } from '../definitions/constants';
import {
  getEnumsFromConstants,
  getFullNameString,
  getLabelsFromConstants,
} from '../utils';

/** @type {PageSchema} */
export default {
  uiSchema: {
    // required span needs to be in page header here, per mockup
    'ui:title': (
      <h3 className="custom-header authorizer-type">
        How long do you authorize us to release your information for?{' '}
        <span className="custom-required-span">(*Required)</span>
      </h3>
    ),
    releaseDuration: {
      'ui:widget': 'radio',
      'ui:errorMessages': {
        required: 'Please select a release duration.',
      },
      'ui:options': {
        // dynamically update title based on form data
        // it's serving more as a description here than a label
        // we're hiding required span from this label via styling, per mockup
        updateSchema: formData => {
          const { thirdPartyType, personFullName, organizationName } = formData;
          let thirdPartyName = '[third-party name]';

          if (
            thirdPartyType === THIRD_PARTY_TYPES.PERSON &&
            personFullName.first &&
            personFullName.last
          ) {
            thirdPartyName = getFullNameString(personFullName);
          } else if (
            thirdPartyType === THIRD_PARTY_TYPES.ORGANIZATION &&
            organizationName
          ) {
            thirdPartyName = organizationName;
          }

          return {
            title: `Tell us when, and how long, we should release your information to ${thirdPartyName}.`,
          };
        },
        labels: getLabelsFromConstants(RELEASE_DURATIONS),
      },
    },
  },
  schema: {
    type: 'object',
    required: ['releaseDuration'],
    properties: {
      releaseDuration: {
        type: 'string',
        enum: getEnumsFromConstants(RELEASE_DURATIONS),
      },
    },
  },
};
