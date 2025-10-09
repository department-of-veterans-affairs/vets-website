import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const defaultContent = `You can update the email address we have on file for
  you at any time in your VA.gov profile.`;

const CONFIRM_SUCCESS_PROPS = {
  status: 'success',
  dataTestid: 'alert-confirm-success',
  headline: 'Thank you for confirming your contact email address',
  content: defaultContent,
};

const SKIP_SUCCESS_PROPS = {
  status: 'success',
  dataTestid: 'alert-skip-success',
  headline: 'Okay, we’ll skip adding a contact email for now',
  content: defaultContent,
};

const CONFIRM_ERROR_PROPS = {
  status: 'error',
  dataTestid: 'alert-confirm-error',
  headline: 'We couldn’t confirm your contact email',
  content: `Please try again.`,
};

const AlertSystemResponse = ({ status, dataTestid, headline, content }) => (
  <VaAlert
    status={status}
    dataTestid={dataTestid}
    className="vads-u-margin-y--2"
  >
    <h2 slot="headline">{headline}</h2>
    <p className="vads-u-margin-y--0">{content}</p>
  </VaAlert>
);

AlertSystemResponse.propTypes = {
  content: PropTypes.string.isRequired,
  dataTestid: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export const AlertSystemResponseConfirmSuccess = () => (
  <AlertSystemResponse {...CONFIRM_SUCCESS_PROPS} />
);

export const AlertSystemResponseSkipSuccess = () => (
  <AlertSystemResponse {...SKIP_SUCCESS_PROPS} />
);

export const AlertSystemResponseConfirmError = () => (
  <AlertSystemResponse {...CONFIRM_ERROR_PROPS} />
);
