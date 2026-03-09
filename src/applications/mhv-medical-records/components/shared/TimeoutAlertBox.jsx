/**
 * Alert Box component for loading timeout errors
 *
 * @desc: Alert that displays when a loading spinner exceeds its maximum duration,
 *        indicating the page could not be loaded.
 */

import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { ALERT_TYPE_ERROR } from '../../util/constants';

const TimeoutAlertBox = ({ testId, className }) => {
  return (
    <VaAlert
      status={ALERT_TYPE_ERROR}
      visible
      class={`vads-u-margin-y--4 ${className || ''}`}
      aria-live="polite"
      data-testid={testId}
    >
      <h2 slot="headline">We can’t load this page right now</h2>
      <p>
        We’re sorry. There’s a problem with our system. Please refresh this page
        or try again later.
      </p>
      <p>
        If it still doesn’t work, call us at{' '}
        <va-telephone contact={CONTACTS.MY_HEALTHEVET} /> (
        <va-telephone tty contact={CONTACTS['711']} />
        ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
      </p>
    </VaAlert>
  );
};

export default TimeoutAlertBox;

TimeoutAlertBox.propTypes = {
  className: PropTypes.string,
  testId: PropTypes.string,
};
