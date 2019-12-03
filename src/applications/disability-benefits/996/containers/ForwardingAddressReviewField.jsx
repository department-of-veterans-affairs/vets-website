import React from 'react';

import {
  forwardingAddressCheckboxLabel,
  forwardingAddressCheckboxDescription,
} from '../content/ForwardingAddress';

export default function ForwardingAddressReviewField(props) {
  const { children } = props;

  return children?.props.formData ? (
    <div className="review-row">
      <dt className="vads-u-measure--none">
        {forwardingAddressCheckboxLabel}
        <br />
        <br />
        {forwardingAddressCheckboxDescription}
      </dt>
      <dd>
        <strong>{children}</strong>
      </dd>
    </div>
  ) : (
    <div className="review-row">
      <dt>{forwardingAddressCheckboxLabel}</dt>
      <dd>{children}</dd>
    </div>
  );
}
