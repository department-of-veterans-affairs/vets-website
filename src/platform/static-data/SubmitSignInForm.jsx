import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  createHref,
  formatAriaLabel,
  formatPhoneNumber,
} from './utilities/sign-in-phone-utils';

// NOTE: Do not convert these phone links to web components as they are
// used in the injected header, which does not support web components
export default function SubmitSignInForm({ startSentence }) {
  const helpDeskNumber = CONTACTS.HELP_DESK;
  const ttyNumber = CONTACTS['711'];

  const helpDeskLink = (
    <a
      href={createHref(helpDeskNumber)}
      aria-label={formatAriaLabel(helpDeskNumber)}
    >
      {formatPhoneNumber(helpDeskNumber)}
    </a>
  );

  const ttyLink = (
    <a
      aria-label={formatAriaLabel(ttyNumber, true)}
      href={createHref(ttyNumber)}
    >
      {formatPhoneNumber(ttyNumber, true)}
    </a>
  );

  return (
    <span>
      {startSentence ? 'Call' : 'call'} our MyVA411 main information line for
      help at {helpDeskLink} ({ttyLink}
      ).
    </span>
  );
}

SubmitSignInForm.propTypes = {
  startSentence: PropTypes.bool,
};
