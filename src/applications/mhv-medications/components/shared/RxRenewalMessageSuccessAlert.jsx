import React, { useEffect, useRef } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

const RxRenewalMessageSuccessAlert = () => {
  const alertRef = useRef(null);

  useEffect(() => {
    if (alertRef.current) {
      focusElement(alertRef.current);
    }
  }, []);

  return (
    <VaAlert
      ref={alertRef}
      role="status"
      status="success"
      visible
      className="vads-u-margin-bottom--3"
      data-testid="rx-renewal-message-success-alert"
    >
      <h2 slot="headline">Message Sent</h2>
      <p>
        We shared your renewal request with your selected provider. It can take
        up to 3 days for your medication status to change.
      </p>
      <p className="vads-u-margin-bottom--0">
        <va-link
          href="/my-health/secure-messages/sent/"
          text="Review message in your sent messages"
          active
        />
      </p>
    </VaAlert>
  );
};

export default RxRenewalMessageSuccessAlert;
