import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import { format, isAfter } from 'date-fns';

export default function ReferralTaskCard({ data }) {
  if (!data) {
    return null;
  }

  const { numberOfAppointments, ReferralExpirationDate, UUID } = data;

  const expirationDate = new Date(ReferralExpirationDate);
  const isPastExpirationDate = isAfter(new Date(), expirationDate);

  if (isPastExpirationDate) {
    return null;
  }

  return (
    <va-card
      class={classNames('vads-u-margin-y--3')}
      data-testid="referral-task-card"
    >
      <h4 className="vads-u-margin--0">
        Schedule your physical therapy appointment
      </h4>
      <p>
        {`We’ve approved your referral for ${numberOfAppointments} ${pluralize(
          'appointment',
          numberOfAppointments,
        )} with a community care provider. You must schedule all appointments for this referral by ${format(
          expirationDate,
          'PP',
        )}.`}
      </p>
      <va-link-action
        text="Go to your referral details to start scheduling"
        type="secondary"
        href={`/my-health/appointments/schedule-referral/${UUID}`}
        data-testid={`referral-task-card-schedule-referral-${UUID}`}
      />
    </va-card>
  );
}

ReferralTaskCard.propTypes = {
  /** Referral data */
  data: PropTypes.object,
};
