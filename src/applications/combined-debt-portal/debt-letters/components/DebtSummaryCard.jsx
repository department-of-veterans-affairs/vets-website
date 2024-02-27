import React from 'react';
import head from 'lodash/head';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { deductionCodes } from '../const/deduction-codes';
import { setActiveDebt } from '../../combined/actions/debts';
import { currency } from '../utils/page';
import { debtSummaryText } from '../const/diary-codes/debtSummaryCardContent';
import recordEvent from '~/platform/monitoring/record-event';

const DebtSummaryCard = ({ debt }) => {
  // TODO: currently we do not have a debtID so we need to make one by combining fileNumber and diaryCode
  const mostRecentHistory = head(debt?.debtHistory);

  const debtCardTotal = currency.format(parseFloat(debt.currentAr));
  const debtCardHeading =
    deductionCodes[debt.deductionCode] || debt.benefitType;
  const debtCardSubHeading = debtSummaryText(
    debt.diaryCode,
    mostRecentHistory?.date,
    debtCardTotal,
  );

  return (
    <va-card
      show-shadow
      class="vads-u-padding--3 vads-u-margin-bottom--3"
      data-testid="debt-summary-item"
    >
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--1p5">
        {debtCardTotal}
      </h3>
      <h4 className="vads-u-margin-top--0  vads-u-margin-bottom--1p5 vads-u-font-weight--normal">
        {debtCardHeading}
      </h4>
      {debtCardSubHeading}
      <Link
        className="vads-u-font-weight--bold"
        data-testid="debt-details-button"
        onClick={() => {
          recordEvent({ event: 'cta-link-click-debt-summary-card' });
          setActiveDebt(debt);
        }}
        to={`/debt-balances/details/${debt.fileNumber + debt.deductionCode}`}
        aria-label={`Check details and resolve this ${debtCardHeading}`}
      >
        Check details and resolve this debt
        <i
          aria-hidden="true"
          className="fas fa-angle-right vads-u-margin-left--1"
        />
      </Link>
    </va-card>
  );
};

DebtSummaryCard.propTypes = {
  debt: PropTypes.shape({
    currentAr: PropTypes.number,
    debtHistory: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
      }),
    ),
    deductionCode: PropTypes.string,
    benefitType: PropTypes.string,
    diaryCode: PropTypes.string,
    fileNumber: PropTypes.string,
  }),
};

export default DebtSummaryCard;
