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

const SKIP_SUCCESS_PROPS = {
  status: 'success',
  dataTestid: 'mhv-alert--skip-success',
  headline: 'Okay, we’ll skip adding a contact email for now',
  content: defaultContent,
};

const AlertSystemResponse = ({
  content,
  dataTestid,
  headline,
  headingLevel = 'h2',
  recordEvent = _ => {},
  status,
}) => {
  useEffect(() => recordEvent(headline), [headline, recordEvent]);
  const HeadingTag = headingLevel;
  return (
    <VaAlert
      status={status}
      role="alert"
      dataTestid={dataTestid}
      className="vads-u-margin-y--2"
      tabIndex={-1}
    >
      <HeadingTag slot="headline">
        <span className="usa-sr-only">{status}</span>
        {headline}
      </HeadingTag>
      <p className="vads-u-margin-y--0">{content}</p>
    </VaAlert>
  );
};

AlertSystemResponse.propTypes = {
  content: PropTypes.string.isRequired,
  dataTestid: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  headingLevel: PropTypes.oneOf(['h2', 'h3', 'h4', 'h5', 'h6']),
  recordEvent: PropTypes.func,
};

export const AlertSystemResponseConfirmSuccess = props => (
  <AlertSystemResponse {...CONFIRM_SUCCESS_PROPS} {...props} />
);

export const AlertSystemResponseSkipSuccess = props => (
  <AlertSystemResponse {...SKIP_SUCCESS_PROPS} {...props} />
);
