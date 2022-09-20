import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import CTALink from '../CTALink';
import recordEvent from '~/platform/monitoring/record-event';
import { currency } from '../../utils/helpers';

export const DebtsV2 = ({ debts }) => {
  const totalDebt = debts.reduce((acc, d) => acc + d.currentAr, 0);
  const debtHistory = debts.reduce(
    (acc, debt) => (debt.debtHistory ? acc.concat(debt.debtHistory) : acc),
    [],
  );
  const allDebtHistoryDates = debtHistory
    .reduce((acc, history) => acc.concat(history.date), [])
    .sort((a, b) => {
      const aSplit = a
        .split('/')
        .reverse()
        .join('');
      const bSplit = b
        .split('/')
        .reverse()
        .join('');
      return bSplit.localeCompare(aSplit);
    });
  const lastUpdatedDate = (allDebtHistoryDates || [])[0] || new Date();
  const formattedLastUpdatedDate = format(
    new Date(lastUpdatedDate),
    'MMMM dd, yyyy',
  );
  const debtsCount = debts?.length || 0;
  if (debtsCount < 1) {
    return (
      <p
        className="vads-u-margin-bottom--3 vads-u-margin-top--0"
        data-testid="zero-debt-paragraph-v2"
      >
        Your total VA debt balance is $0.
      </p>
    );
  }

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5">
      <div
        className="vads-u-background-color--gray-lightest vads-u-padding-y--2p5 vads-u-padding-x--2p5"
        data-testid="debt-card-v2"
      >
        <h3 className="vads-u-margin-top--0" data-testid="debt-total-header-v2">
          ({currency(totalDebt)})
        </h3>
        <h4 className="vads-u-margin-top--0">
          {debtsCount} outstanding debt
          {debtsCount > 1 ? 's' : ''}
        </h4>
        <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
          Last updated {formattedLastUpdatedDate}
        </p>
        <CTALink
          text="Manage your VA debt"
          href="/manage-va-debt/your-debt"
          showArrow
          onClick={() =>
            recordEvent({
              event: 'profile-navigation',
              'profile-action': 'view-link',
              'profile-section': 'view-manage-va-debt',
            })
          }
          testId="manage-va-debt-link-v2"
        />
      </div>
    </div>
  );
};

DebtsV2.propTypes = {
  debts: PropTypes.arrayOf(
    PropTypes.shape({
      amountOverpaid: PropTypes.number.isRequired,
      amountWithheld: PropTypes.number.isRequired,
      benefitType: PropTypes.string.isRequired,
      currentAr: PropTypes.number.isRequired,
      debtHistory: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          letterCode: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        }),
      ),
      deductionCode: PropTypes.string.isRequired,
      diaryCode: PropTypes.string.isRequired,
      diaryCodeDescription: PropTypes.string,
      fileNumber: PropTypes.string.isRequired,
      originalAr: PropTypes.number.isRequired,
      payeeNumber: PropTypes.string.isRequired,
      personEntitled: PropTypes.string.isRequired,
    }),
  ),
  hasError: PropTypes.bool,
};

export default DebtsV2;
