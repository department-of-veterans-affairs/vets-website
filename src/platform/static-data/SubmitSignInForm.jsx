import React from 'react';
import PropTypes from 'prop-types';
import { createHref, formatPhoneNumber } from './utilities/sign-in-phone-utils';

// NOTE: Do not convert these phone links to web components as they are
// used in the injected header, which does not support web components
export default function SubmitSignInForm({ startSentence }) {
  const helpDeskNumber = '8662793677';

  const helpDeskLink = (
    <a href={createHref(helpDeskNumber)}>{formatPhoneNumber(helpDeskNumber)}</a>
  );

  return (
    <span>
      {startSentence ? 'Call' : 'call'} our VA.gov technical support line for
      help at {helpDeskLink}.
    </span>
  );
}

SubmitSignInForm.propTypes = {
  startSentence: PropTypes.bool,
};
