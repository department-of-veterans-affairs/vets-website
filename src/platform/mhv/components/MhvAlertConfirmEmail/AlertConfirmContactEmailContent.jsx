import React from 'react';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const AlertConfirmContactEmailContent = ({
  emailAddress,
  isConfirming = false,
  onConfirmClick,
}) => (
  <React.Fragment key=".1">
    <p>
      We’ll send notifications about your VA health care and benefits to this
      email.
    </p>

    <p className="vads-u-font-weight--bold" id="email-address">
      {emailAddress}
    </p>

    <p>
      <va-button
        data-testid="mhv-alert--confirm-email-button"
        text={isConfirming ? 'Confirming' : 'Confirm'}
        onClick={onConfirmClick}
        loading={isConfirming}
        class="vads-u-width--full mobile-lg:vads-u-width--auto vads-u-margin-top--1 vads-u-margin-bottom--1 hydrated"
      />
    </p>

    <p>
      <VaLink
        href="/profile/contact-information#email-address"
        text="Go to profile to update your contact email"
      />
    </p>
  </React.Fragment>
);

AlertConfirmContactEmailContent.propTypes = {
  emailAddress: PropTypes.string.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  isConfirming: PropTypes.bool,
};

export default AlertConfirmContactEmailContent;
