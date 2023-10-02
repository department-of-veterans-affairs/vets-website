import React from 'react';

import {
  AUTHORIZER_TYPES,
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
        updateSchema: (formData, schema, uiSchema) => {
          const {
            authorizerType,
            thirdPartyType,
            personFullName,
            organizationName,
          } = formData;
          const titleString =
            authorizerType === AUTHORIZER_TYPES.VETERAN
              ? 'How much information from your VA record do you authorize us to release to [third-party-name]?'
              : 'I authorize VA to provide [third-party-name] the following information from my VA record:';
          const thirdPartyName =
            thirdPartyType === THIRD_PARTY_TYPES.PERSON
              ? getFullNameString(personFullName)
              : organizationName;

          // eslint-disable-next-line no-param-reassign
          uiSchema['ui:reviewField'] = ({ children }) => (
            // prevent ui:title's <h3> from getting pulled into
            // review-field's <dt> & causing a11y headers-hierarchy errors.
            <div className="review-row">
              <dt>
                {titleString.replace('[third-party-name]', thirdPartyName)}
              </dt>
              <dd>{children}</dd>
            </div>
          );

          return {
            title: (
              <h3 style={{ display: 'inline' }}>
                {titleString.replace('[third-party-name]', thirdPartyName)}
              </h3>
            ),
            uiSchema,
          };
        },
      },
      'ui:errorMessages': {
        required:
          'Please select how much information you would like us to release',
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
