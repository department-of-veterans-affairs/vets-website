import React from 'react';

import {
  THIRD_PARTY_TYPES,
  SECURITY_QUESTIONS,
} from '../definitions/constants';
import {
  getEnumsFromConstants,
  getFullNameString,
  getLabelsFromConstants,
} from '../utils';

/** @type {PageSchema} */
export default {
  uiSchema: {
    securityQuestion: {
      'ui:widget': 'radio',
      'ui:errorMessages': {
        required: 'Please select a question.',
      },
      'ui:options': {
        updateSchema: (formData, schema, uiSchema) => {
          const { thirdPartyType, personFullName, organizationName } = formData;
          let thirdPartyName = 'the third-party';
          let labelString = '';

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

          labelString = `What security question should we ask ${thirdPartyName} to verify their identity?`;

          // eslint-disable-next-line no-param-reassign
          uiSchema['ui:reviewField'] = ({ children }) => (
            // prevent ui:title's <h3> from getting pulled into
            // review-field's <dt> & causing a11y headers-hierarchy errors.
            <div className="review-row">
              <dt>{labelString}</dt>
              <dd>{children}</dd>
            </div>
          );

          return {
            title: (
              <>
                <h3>
                  {labelString}{' '}
                  <span className="vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-color--secondary-dark">
                    (*Required)
                  </span>
                </h3>
                <span className="vads-u-margin-bottom--0 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-line-height--4 vads-u-display--block">
                  Select a security question. We’ll ask you to enter the answer
                  on the next screen. You’ll then need to give the answer to
                  your designated third-party source.
                  <br />
                  <br />
                  We’ll ask this question each time your designated third-party
                  source contacts us.
                </span>
              </>
            ),
            uiSchema,
          };
        },
        labels: getLabelsFromConstants(SECURITY_QUESTIONS),
      },
    },
  },
  schema: {
    type: 'object',
    required: ['securityQuestion'],
    properties: {
      securityQuestion: {
        type: 'string',
        enum: getEnumsFromConstants(SECURITY_QUESTIONS),
      },
    },
  },
};
