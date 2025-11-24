import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import AlertConfirmContactEmailContent from './AlertConfirmContactEmailContent';

/**
 * This component is very similar to AlertConfirmContactEmail, but is slightly modified
 * to indicate an error state.
 */
const AlertConfirmAddContactEmailError = ({
  emailAddress,
  onConfirmClick,
  recordEvent,
}) => {
  const headline = 'We couldn’t confirm your contact email';
  useEffect(() => recordEvent(headline), [headline, recordEvent]);

  return (
    <VaAlert
      status="error"
      role="alert"
      dataTestid="mhv-alert--confirm-error"
      className="vads-u-margin-y--2"
    >
      <h2 slot="headline">
        <span className="usa-sr-only">error</span>
        {headline}
      </h2>
      <p>Please try again.</p>
      <AlertConfirmContactEmailContent
        emailAddress={emailAddress}
        onConfirmClick={() => onConfirmClick()}
      />
    </VaAlert>
  );
};

AlertConfirmAddContactEmailError.propTypes = {
  emailAddress: PropTypes.string.isRequired,
  recordEvent: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
};

export default AlertConfirmAddContactEmailError;
