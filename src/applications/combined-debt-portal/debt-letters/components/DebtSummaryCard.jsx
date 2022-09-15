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
    <article
      className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2"
      data-testid="debt-summary-item"
    >
      <h3 className="vads-u-margin--0">{debtCardTotal}</h3>
      <p className="vads-u-margin-y--2 vads-u-font-weight--normal">
        {debtCardHeading}
      </p>
      {debtCardSubHeading}
      <div className="vads-u-margin-right--5 vads-u-margin-top--2 vads-u-font-weight--bold">
        <Link
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
            className="fa fa-chevron-right vads-u-font-size--sm vads-u-margin-left--0p5"
          />
        </Link>
      </div>
    </article>
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
