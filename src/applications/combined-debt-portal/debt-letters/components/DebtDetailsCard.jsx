import React from 'react';
import { head } from 'lodash';
import PropTypes from 'prop-types';
// import { deductionCodes } from '../const/deduction-codes';
// import { setActiveDebt } from '../../combined/actions/debts';
import { format, isValid } from 'date-fns';
import recordEvent from '~/platform/monitoring/record-event';
import last from 'lodash/last';
import { Link } from 'react-router-dom';
import { getDebtDetailsCardContent } from '../const/diary-codes/debtDetailsCardContent';
import { currency } from '../utils/page';

// Define the Chapter 33 debt codes
const CHAPTER_33_DEBT_CODES = [
  '71',
  '72',
  '73',
  '74',
  '75',
  '76',
  '77',
  '78',
  '79',
];

const DebtDetailsCard = ({ debt, showOTPP }) => {
  const dates = debt?.debtHistory?.map(m => new Date(m.date)) ?? [];
  const sortedHistory = dates.sort((a, b) => Date.parse(b) - Date.parse(a));
  const mostRecentDate = isValid(head(sortedHistory))
    ? format(head(sortedHistory), 'MM/dd/yyyy')
    : '';

  const firstPaymentDate = last(debt.fiscalTransactionData)?.transactionDate;
  const dueDate = new Date(firstPaymentDate);
  const addedDaysForDueDate = 60;
  dueDate.setDate(dueDate.getDate() + addedDaysForDueDate);
  const formattedDueDate = isValid(dueDate)
    ? format(dueDate, 'MM/dd/yyyy')
    : '';

  const convertedAr = currency.format(parseFloat(debt.currentAr));

  const debtCardContent = getDebtDetailsCardContent(
    debt,
    mostRecentDate,
    convertedAr,
  );

  // Check if the debt is a Chapter 33 debt based on the deduction code
  const isChapter33Debt = CHAPTER_33_DEBT_CODES.includes(debt.deductionCode);

  return (
    <>
      {isChapter33Debt && (
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
            benefit offset, check, credit card, or ACH. Your payment will not be
            considered late and will reflect the date received once system
            updates are completed. This message only applies to Post 9-11,
            Chapter 33 debts.
          </p>
        </va-alert>
      )}
      {!isChapter33Debt &&
        showOTPP && (
          <>
            <va-alert
              background-only
              status="warning"
              data-testid="status-alert"
            >
              <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
                {/* using vads-u-margin-left here causes the word "before" 
      to wrap to the next line so we need a {' '} space here */}
                Pay your {convertedAr} balance or request help now
              </h2>
              <p>
                To avoid late fees or collection action on your bill, you must
                pay your full balance or request financial help before
                <span className="vads-u-margin-left--0p5">
                  {formattedDueDate}
                </span>
                .
              </p>
              <p>
                <va-link
                  href="/manage-va-debt/summary/debt-balances/"
                  icon-name="chevron_right"
                  icon-size={3}
                  text="Back to current debts"
                  class="vads-u-font-weight--bold vads-u-margin-left--neg0p5 vads-u-margin-top--2"
                />

                <Link
                  className="vads-u-font-weight--bold"
                  to={`/debt-balances/details/${debt.compositeDebtId}/resolve`}
                  data-testid={`resolve-link-${debt.compositeDebtId}`}
                  onClick={() => {
                    recordEvent({
                      event: 'cta-link-click-debt-details-card',
                    });
                  }}
                >
                  Pay your balance, request financial help, or dispute this bill
                  <va-icon icon="chevron_right" size={3} aria-hidden="true" />
                </Link>
              </p>
            </va-alert>
          </>
        )}
      {!showOTPP &&
        debtCardContent.showLinks && (
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
                        recordEvent({
                          event: 'cta-link-click-debt-make-payment',
                        });
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
                        recordEvent({
                          event: 'cta-link-click-debt-request-help',
                        });
                      }}
                    >
                      Request help with your debt
                    </a>
                  </p>
                )}
              </>
            )}
          </va-alert>
        )}
    </>
  );
};

DebtDetailsCard.propTypes = {
  debt: PropTypes.shape({
    compositeDebtId: PropTypes.string.isRequired,
    currentAr: PropTypes.number,
    convertedAr: PropTypes.number,
    debtHistory: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
      }),
    ),
    deductionCode: PropTypes.string,
    fiscalTransactionData: PropTypes.arrayOf(
      PropTypes.shape({
        transactionDate: PropTypes.string,
      }),
    ),
    originalAr: PropTypes.number,
    benefitType: PropTypes.string,
    diaryCode: PropTypes.string,
  }),
  showOTPP: PropTypes.bool,
};

export default DebtDetailsCard;
