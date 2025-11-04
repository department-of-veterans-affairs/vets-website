import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const defaultContent = `You can update the email address we have on file for
  you at any time in your VA.gov profile.`;

const CONFIRM_SUCCESS_PROPS = {
  status: 'success',
  dataTestid: 'mhv-alert--confirm-success',
  headline: 'Thank you for confirming your contact email address',
  content: defaultContent,
};

const CONFIRM_ERROR_PROPS = {
  status: 'error',
  dataTestid: 'mhv-alert--confirm-error',
  headline: 'We couldn’t confirm your contact email',
  content: `Please try again.`,
};

const SKIP_SUCCESS_PROPS = {
  status: 'success',
  dataTestid: 'mhv-alert--skip-success',
  headline: 'Okay, we’ll skip adding a contact email for now',
  content: defaultContent,
};

const AlertSystemResponse = React.forwardRef(
  ({ content, dataTestid, headline, recordEvent = _ => {}, status }, ref) => {
    useEffect(() => recordEvent(headline), [headline, recordEvent]);
    return (
      <VaAlert
        status={status}
        role="alert"
        dataTestid={dataTestid}
        className="vads-u-margin-y--2"
        ref={ref}
        tabIndex={-1}
      >
        <h2 slot="headline">{headline}</h2>
        <p className="vads-u-margin-y--0">{content}</p>
      </VaAlert>
    );
  },
);

AlertSystemResponse.propTypes = {
  content: PropTypes.string.isRequired,
  dataTestid: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  recordEvent: PropTypes.func,
};

export const AlertSystemResponseConfirmSuccess = React.forwardRef(
  (props, ref) => (
    <AlertSystemResponse {...CONFIRM_SUCCESS_PROPS} {...props} ref={ref} />
  ),
);

export const AlertSystemResponseConfirmError = React.forwardRef(
  (props, ref) => (
    <AlertSystemResponse {...CONFIRM_ERROR_PROPS} {...props} ref={ref} />
  ),
);

export const AlertSystemResponseSkipSuccess = React.forwardRef((props, ref) => (
  <AlertSystemResponse {...SKIP_SUCCESS_PROPS} {...props} ref={ref} />
));
