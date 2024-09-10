import React from 'react';
import { head } from 'lodash';
import PropTypes from 'prop-types';
// import { deductionCodes } from '../const/deduction-codes';
// import { setActiveDebt } from '../../combined/actions/debts';
import { format, isValid } from 'date-fns';
import recordEvent from '~/platform/monitoring/record-event';
import { getDebtDetailsCardContent } from '../const/diary-codes/debtDetailsCardContent';
import { currency } from '../utils/page';

// Define the Chapter 33 debt codes
const CHAPTER_33_DEBT_CODES = ['70', '71', '72', '73', '74', '75'];

const DebtDetailsCard = ({ debt }) => {
  const dates = debt?.debtHistory?.map(m => new Date(m.date)) ?? [];
  const sortedHistory = dates.sort((a, b) => Date.parse(b) - Date.parse(a));
  const mostRecentDate = isValid(head(sortedHistory))
    ? format(head(sortedHistory), 'MM/dd/yyyy')
    : '';
  const convertedAr = currency.format(parseFloat(debt.currentAr));

  const debtCardContent = getDebtDetailsCardContent(
    debt,
    mostRecentDate,
    convertedAr,
  );

  // Check if the debt is a Chapter 33 debt based on the deduction code
  const isChapter33Debt = CHAPTER_33_DEBT_CODES.includes(debt.deductionCode);

  // Get the current date
  const currentDate = new Date();
  const endDate = new Date('2024-07-19');

  // Check if the current date is before the end date
  const showChapter33Alert = isChapter33Debt && currentDate <= endDate;

  return (
    <>
      {showChapter33Alert && (
        <va-alert
          class="vads-u-margin-bottom--2"
          close-btn-aria-label="Close notification"
          disable-analytics="false"
          full-width="false"
          slim
          status="warning"
          visible="true"
        >
          <p className="vads-u-margin-y--0">
            VA is transitioning to a new system for processing Post 9-11 Chapter
            33 financial transactions. Due to this transition, Chapter 33 debt
            balance information may not reflect recent payments you have made by
            check, credit card, or ACH. Your payment will not be considered late
            and will reflect the date received once system updates are
            completed. This message only applies to Post 9-11, Chapter 33 debts.
          </p>
        </va-alert>
      )}

      <va-alert
        class="vads-u-margin-bottom--1"
        disable-analytics="false"
        full-width="false"
        show-icon={debtCardContent.showIcon}
        status={debtCardContent.status}
        visible="true"
      >
        <h2 slot="headline">{debtCardContent.headerText}</h2>

        {debtCardContent.bodyText}

        {debtCardContent.showLinks && (
          <>
            {debtCardContent.showMakePayment && (
              <p>
                <a
                  aria-label="Make a payment"
                  className="vads-c-action-link--blue"
                  data-testid="link-make-payment"
                  href="https://www.pay.va.gov/"
                  onClick={() => {
                    recordEvent({ event: 'cta-link-click-debt-make-payment' });
                  }}
                >
                  Make a payment
                </a>
              </p>
            )}
            {debtCardContent.showRequestHelp && (
              <p>
                <a
                  aria-label="Request help with your debt"
                  className="vads-c-action-link--blue"
                  data-testid="link-request-help"
                  href="/manage-va-debt/request-debt-help-form-5655"
                  onClick={() => {
                    recordEvent({ event: 'cta-link-click-debt-request-help' });
                  }}
                >
                  Request help with your debt
                </a>
              </p>
            )}
          </>
        )}
      </va-alert>
    </>
  );
};

DebtDetailsCard.propTypes = {
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
  }),
};

export default DebtDetailsCard;
