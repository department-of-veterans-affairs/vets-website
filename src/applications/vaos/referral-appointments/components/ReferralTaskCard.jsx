import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { format, isAfter } from 'date-fns';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { selectCurrentPage } from '../redux/selectors';
import { routeToNextReferralPage } from '../flow';

export default function ReferralTaskCard({ data }) {
  const currentPage = useSelector(selectCurrentPage);
  const history = useHistory();

  if (!data) {
    return null;
  }

  const { expirationDate, uuid } = data;

  const expirationDateObject = new Date(expirationDate);
  const isPastExpirationDate = isAfter(new Date(), expirationDateObject);

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
        {`We’ve approved your community care referral. You must schedule all appointments for this referral by ${format(
          expirationDateObject,
          'PP',
        )}.`}
      </p>
      <va-link-action
        text="Go to your referral details to start scheduling"
        type="secondary"
        data-testid={`referral-task-card-schedule-referral-${uuid}`}
        onClick={() => {
          routeToNextReferralPage(history, currentPage, uuid);
        }}
      />
    </va-card>
  );
}

ReferralTaskCard.propTypes = {
  /** Referral data */
  data: PropTypes.object,
};
