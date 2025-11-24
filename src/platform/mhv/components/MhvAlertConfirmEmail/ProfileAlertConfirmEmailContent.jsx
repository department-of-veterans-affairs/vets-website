import React from 'react';
import PropTypes from 'prop-types';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const ProfileAlertConfirmEmailContent = ({
  emailAddress,
  onConfirmClick,
  onEditClick,
}) => (
  <React.Fragment key=".1">
    <p>
      We’ll send notifications about your VA health care and benefits to this
      email.
    </p>
    <p className="vads-u-font-weight--bold" style={{ wordBreak: 'break-word' }}>
      {emailAddress}
    </p>
    <VaButtonPair
      onPrimaryClick={() => {
        onConfirmClick();
      }}
      onSecondaryClick={() => onEditClick()}
      leftButtonText="Confirm"
      rightButtonText="Edit contact email"
    />
  </React.Fragment>
);

ProfileAlertConfirmEmailContent.propTypes = {
  emailAddress: PropTypes.string.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
