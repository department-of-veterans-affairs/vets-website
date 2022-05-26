import React from 'react';
import head from 'lodash/head';
import PropTypes from 'prop-types';
// import { deductionCodes } from '../const/deduction-codes';
// import { setActiveDebt } from '../../combined/actions/debts';
import { getDebtDetailsCardContent } from '../const/diary-codes/debtDetailsCardContent';
import { currency } from '../utils/page';

const DebtLetterCard = ({ debt }) => {
  // TODO: currently we do not have a debtID so we need to make one by combining fileNumber and diaryCode
  const mostRecentHistory = head(debt?.debtHistory);

  const convertedAr = currency.format(parseFloat(debt.currentAr));

  const debtCardContent = getDebtDetailsCardContent(
    debt,
    mostRecentHistory?.date,
    convertedAr,
  );

  return (
    <va-alert
      background-only
      class="vads-u-margin-bottom--1"
      disable-analytics="false"
      full-width="false"
      show-icon={debtCardContent.showIcon}
      status={debtCardContent.status}
      visible="true"
    >
      <h3 className="vads-u-margin--0">{debtCardContent.headerText}</h3>

      <div>
        <p className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans">
          {debtCardContent.bodyText}
        </p>
      </div>

      {debtCardContent.showLinks && (
        <div className="vads-u-margin-y--2">
          {debtCardContent.showMakePayment && (
            <div>
              <a
                className="vads-u-font-size--md vads-u-font-weight--bold"
                aria-label="Make a payment"
                href="https://www.pay.va.gov/"
              >
                <i
                  aria-hidden="true"
                  className="fas fa-chevron-circle-right fa-2x vads-u-margin-right--1"
                />
                Make a payment
              </a>
            </div>
          )}
          {debtCardContent.showRequestHelp && (
            <div>
              <a
                className="vads-u-font-size--md vads-u-font-weight--bold"
                aria-label="Request help with your debt"
                href="/manage-va-debt/request-debt-help-form-5655"
              >
                <i
                  className="fas fa-chevron-circle-right fa-2x vads-u-margin-right--1"
                  aria-hidden="true"
                />
                Request help with your debt
              </a>
            </div>
          )}
        </div>
      )}
    </va-alert>
  );
};

DebtLetterCard.propTypes = {
  debt: PropTypes.shape({
    currentAr: PropTypes.number,
    convertedAr: PropTypes.number,
    debtHistory: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
      }),
    ),
    deductionCode: PropTypes.string,
    originalAr: PropTypes.number,
    benefitType: PropTypes.string,
    diaryCode: PropTypes.string,
    fileNumber: PropTypes.string,
  }),
};

export default DebtLetterCard;
