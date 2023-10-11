import React from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export default function CallVBACenter({ startSentence }) {
  return (
    <span>
      {startSentence ? 'Call' : 'call'} VA Benefits and Services at{' '}
      <va-telephone contact={CONTACTS.VA_BENEFITS} />.<br /> If you have hearing
      loss, call <va-telephone contact={CONTACTS['711']} tty />.
    </span>
  );
}

CallVBACenter.propTypes = {
  startSentence: PropTypes.bool,
};
