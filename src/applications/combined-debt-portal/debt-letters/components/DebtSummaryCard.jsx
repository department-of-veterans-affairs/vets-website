import React from 'react';
import head from 'lodash/head';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { deductionCodes } from '../const/deduction-codes';
import { setActiveDebt } from '../../combined/actions/debts';
import { currency } from '../utils/page';
import { debtSummaryText } from '../const/diary-codes/debtSummaryCardContent';

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
    <li>
      <va-card
        show-shadow
        class="vads-u-padding--3 vads-u-margin-bottom--3"
        data-testid="debt-summary-item"
      >
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--1p5 vads-u-font-size--h3">
          {debtCardHeading}
        </h2>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--1p5 vads-u-font-size--h4 vads-u-font-family--serif">
          <span className="vads-u-font-weight--normal">Current balance: </span>
          <strong>{debtCardTotal} </strong>
        </p>
        {debtCardSubHeading}
        <va-link
          active
          data-testid="debt-details-button"
          onClick={() => {
            recordEvent({ event: 'cta-link-click-debt-summary-card' });
            setActiveDebt(debt);
          }}
          href={`/manage-va-debt/summary/debt-balances/details/${debt.fileNumber +
            debt.deductionCode}`}
          text="Check details and resolve this debt"
          aria-label={`Check details and resolve this ${debtCardHeading}`}
        />
      </va-card>
    </li>
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
