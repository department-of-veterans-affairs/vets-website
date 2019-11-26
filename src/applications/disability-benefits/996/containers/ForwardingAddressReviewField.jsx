import React from 'react';

import {
  forwardingAddressCheckboxLabel,
  forwardingAddressCheckboxDescription,
} from '../content/ForwardingAddress';

export default function ForwardingAddressReviewField(props) {
  const { children } = props;

  // Not using <dt> & <dd> as the <dt> matches the width of the other
  // elements inside the wrapping <dl>. The design calls for the content
  // to be much wider
  return children?.props.formData ? (
    <div className="review-row vads-u-display--flex">
      <div className="vads-u-flex-fill">
        {forwardingAddressCheckboxLabel}
        <br />
        <br />
        {forwardingAddressCheckboxDescription}
      </div>
      <strong className="vads-u-flex-1">{children}</strong>
    </div>
  ) : (
    <div className="review-row">
      <dt>{forwardingAddressCheckboxLabel}</dt>
      <dd>{children}</dd>
    </div>
  );
}
