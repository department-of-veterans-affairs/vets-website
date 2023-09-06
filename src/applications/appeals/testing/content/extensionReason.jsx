import React from 'react';

import { MAX_LENGTH } from '../../10182/constants';

const title = 'Reason for extension';

export const content = {
  title: <h1 className="vads-u-margin-top--0">{title}</h1>,
  description: (
    <p className="vads-u-margin-top--0">
      Tell us why you have good cause for an extension.
    </p>
  ),
  label: 'Reason for requesting an extension:',
  hint: `${MAX_LENGTH.EXTENSION_REASON} characters max.`,
  errorMessage: 'This field cannot be left blank.',
};

export const ExtensionReasonReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{title}</dt>
    <dd>
      {children?.props?.formData ? (
        <span>Added reason for extension</span>
      ) : (
        <span className="usa-input-error-message">
          Missing reason for extension
        </span>
      )}
    </dd>
  </div>
);
