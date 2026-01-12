import React from 'react';
import PropTypes from 'prop-types';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

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
      <LoadingButton
        onClick={onConfirmClick}
        isLoading={isConfirming}
        loadingText="Confirming email"
      >
        Confirm
      </LoadingButton>
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
