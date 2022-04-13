import React from 'react';
import PropTypes from 'prop-types';
import '../../sass/user-profile.scss';
import DebtNotification from './DebtNotification';

export const Notifications = ({ debts, debtsError }) => {
  return (
    <div data-testid="dashboard-notifications">
      <h2>Notifications</h2>
      <DebtNotification debts={debts} hasError={debtsError} />
    </div>
  );
};

Notifications.propTypes = {
  debtsError: PropTypes.bool,
  debts: PropTypes.arrayOf(
    PropTypes.shape({
      fileNumber: PropTypes.string.isRequired,
      payeeNumber: PropTypes.string.isRequired,
      personEntitled: PropTypes.string.isRequired,
      deductionCode: PropTypes.string.isRequired,
      benefitType: PropTypes.string.isRequired,
      diaryCode: PropTypes.string.isRequired,
      diaryCodeDescription: PropTypes.string,
      amountOverpaid: PropTypes.number.isRequired,
      amountWithheld: PropTypes.number.isRequired,
      originalAr: PropTypes.number.isRequired,
      currentAr: PropTypes.number.isRequired,
      debtHistory: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          letterCode: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        }),
      ),
    }),
  ),
};

export default Notifications;
