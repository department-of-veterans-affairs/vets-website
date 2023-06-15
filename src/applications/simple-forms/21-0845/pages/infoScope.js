import React from 'react';

import {
  THIRD_PARTY_TYPES,
  INFORMATION_SCOPES,
} from '../definitions/constants';
import { getFullNameString } from '../utils';

/** @type {PageSchema} */
export default {
  uiSchema: {
    informationScope: {
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          [INFORMATION_SCOPES.LIMITED]: 'Limited information',
          [INFORMATION_SCOPES.ANY]: 'Any information',
        },
        updateSchema: formData => {
          const { thirdPartyType, personFullName, organizationName } = formData;
          let titleString =
            'How much information from your VA record do you authorize us to release to ';

          if (thirdPartyType === THIRD_PARTY_TYPES.PERSON) {
            titleString += personFullName.first
              ? getFullNameString(personFullName)
              : '[Person’s name]';
          } else {
            titleString += organizationName || '[Organization’s name]';
          }

          return {
            title: (
              <span className="vads-u-font-family--serif vads-u-font-size--h4 vads-u-font-weight--bold">
                {titleString}?
              </span>
            ),
          };
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['informationScope'],
    properties: {
      informationScope: {
        type: 'string',
        enum: Object.values(INFORMATION_SCOPES),
      },
    },
  },
};
