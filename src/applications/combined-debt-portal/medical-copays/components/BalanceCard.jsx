import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import {
  VaLoadingIndicator,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  currency,
  calcDueDate,
  formatDate,
  verifyCurrentBalance,
} from '../../combined/utils/helpers';

const CurrentContent = ({ id, date }) => (
  <p className="vads-u-margin--0">
    Your balance was updated on {formatDate(date)}. Pay your balance now or
    request help by{' '}
    <strong data-testid={`due-date-${id}`}>{calcDueDate(date, 30)}</strong>.
  </p>
);

CurrentContent.propTypes = {
  date: PropTypes.string,
  id: PropTypes.string,
};

const PastDueContent = ({ id, date }) => (
  <p className="vads-u-margin--0">
    Pay your balance now or request help by{' '}
    <strong data-testid={`due-date-${id}`}>{formatDate(date)}</strong>.
  </p>
);

PastDueContent.propTypes = {
  date: PropTypes.string,
  id: PropTypes.string,
};

const BalanceCard = ({ id, amount, facility, city, date }) => {
  const history = useHistory();

  const { useToggleLoadingValue } = useFeatureToggle();
  // boolean value to represent if toggles are still loading or not
  const togglesLoading = useToggleLoadingValue();
  const isCurrentBalance = verifyCurrentBalance(date);

  // give features a chance to fully load before we conditionally render
  if (togglesLoading) {
    return <VaLoadingIndicator message="Loading features..." />;
  }

  return (
    <va-card
      show-shadow
      class="vads-u-padding--3 vads-u-margin-bottom--3"
      data-testid={`balance-card-${id}`}
    >
      <h3
        data-testid={`facility-city-${id}`}
        className="vads-u-margin-top--0 vads-u-margin-bottom--1p5"
      >
        {facility} - {city}
      </h3>
      <p
        className="vads-u-margin-top--0 vads-u-margin-bottom--1p5 vads-u-font-size--h4 vads-u-font-family--serif"
        data-testid={`amount-${id}`}
      >
        <span className="vads-u-font-weight--normal">Current balance: </span>
        <strong>{currency(amount)}</strong>
      </p>
      <div className="vads-u-display--flex vads-u-margin-top--0  vads-u-margin-bottom--1p5">
        <va-icon
          icon="warning"
          size={3}
          srtext="Important"
          class="icon-color--warning vads-u-padding-right--1"
        />
        {isCurrentBalance ? (
          <CurrentContent id={id} date={date} />
        ) : (
          <PastDueContent id={id} date={date} />
        )}
      </div>
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <p className="vads-u-margin--0">
          <VaLink
            active
            data-testid={`detail-link-${id}`}
            onClick={event => {
              event.preventDefault();
              recordEvent({ event: 'cta-link-click-copay-balance-card' });
              history.push(`/copay-balances/${id}`);
            }}
            href={`/copay-balances/${id}`}
            text="Review details"
            label={`Review details for ${facility}`}
          />
        </p>

        <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
          <VaLink
            active
            data-testid={`resolve-link-${id}`}
            onClick={event => {
              event.preventDefault();
              recordEvent({ event: 'cta-link-click-copay-balance-card' });
              history.push(`/copay-balances/${id}/resolve`);
            }}
            href={`/copay-balances/${id}/resolve`}
            text="Resolve this bill"
            label={`Resolve this bill for ${facility}`}
          />
        </p>
      </div>
    </va-card>
  );
};

BalanceCard.propTypes = {
  amount: PropTypes.number,
  city: PropTypes.string,
  date: PropTypes.string,
  facility: PropTypes.string,
  id: PropTypes.string,
};

export default BalanceCard;
