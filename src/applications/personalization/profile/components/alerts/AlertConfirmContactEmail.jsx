import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isAfter } from 'date-fns';
import recordEvent from '~/platform/monitoring/record-event';

import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  isProfileLoading,
  selectVAPContactInfo,
} from '@department-of-veterans-affairs/platform-user/selectors';

export const EMAIL_UPDATED_AT_THRESHOLD = '2025-03-01T12:00:00.000+00:00';

const selectVAPEmailUpdatedAt = state =>
  selectVAPContactInfo(state)?.email?.updatedAt;

/* eslint-disable-next-line prettier/prettier */
export const showConfirmEmail = state => (date = EMAIL_UPDATED_AT_THRESHOLD) => {
  const profileLoading = isProfileLoading(state);
  const emailUpdatedAt = selectVAPEmailUpdatedAt(state);
  const recentlyUpdated = isAfter(new Date(emailUpdatedAt), new Date(date));
  return !profileLoading && !recentlyUpdated;
};

const AlertConfirmContactEmail = ({ recordEventFn = recordEvent } = {}) => {
  const isVisible = useSelector(showConfirmEmail)();
  const emailUpdatedAt = useSelector(selectVAPEmailUpdatedAt);
  const h2Content = emailUpdatedAt
    ? 'Confirm your contact email'
    : 'Add a contact email';

  useEffect(
    () => {
      if (isVisible) {
        recordEventFn({
          event: 'nav-alert-box-load',
          action: 'load',
          'alert-box-headline': h2Content,
          'alert-box-status': 'warning',
        });
      }
    },
    [h2Content, isVisible, recordEventFn],
  );

  return (
    <VaAlert
      className="vads-u-margin-top--1"
      status="warning"
      visible={isVisible}
      data-testid="va-profile--alert-confirm-contact-email"
    >
      <h2 slot="headline">{h2Content}</h2>
      <React.Fragment key=".1">
        <p className="vads-u-margin-y--0">
          We’ll send notifications about your VA health care and benefits to
          this email.
        </p>
      </React.Fragment>
    </VaAlert>
  );
};

AlertConfirmContactEmail.propTypes = {
  recordEventFn: PropTypes.func,
};

export default AlertConfirmContactEmail;
