import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const RxRenewalMessageSuccessAlert = () => {
  return (
    <VaAlert
      role="status"
      status="success"
      visible
      className="vads-u-margin-bottom--3"
    >
      <h2 slot="headline">Message Sent</h2>
      <p>
        We shared your renewal request with your selected provider. It can take
        up to 3 days for your medication status to change.
      </p>
      <p className="vads-u-margin-bottom--0">
        <va-link
          href="/my-health/secure-messages/inbox/"
          text="Review message in your sent messages"
          active
        />
      </p>
    </VaAlert>
  );
};

export default RxRenewalMessageSuccessAlert;
