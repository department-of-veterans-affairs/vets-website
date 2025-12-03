import React from 'react';
import { head } from 'lodash';
import PropTypes from 'prop-types';
// import { deductionCodes } from '../const/deduction-codes';
// import { setActiveDebt } from '../../combined/actions/debts';
import { format, isValid } from 'date-fns';
import recordEvent from '~/platform/monitoring/record-event';
import { useHistory } from 'react-router-dom';
import { getDebtDetailsCardContent } from '../const/diary-codes/debtDetailsCardContent';
import { currency } from '../utils/page';

const DebtDetailsCard = ({ debt, showOTPP }) => {
  const history = useHistory();
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

  return showOTPP ? (
    <va-alert
      class="vads-u-margin-bottom--1"
      disable-analytics="false"
      full-width="false"
      status={debtCardContent.status}
      visible="true"
    >
      <h2 slot="headline">{debtCardContent.headerText}</h2>

      {debtCardContent.bodyText}

      {debtCardContent.showLinks && (
        <va-link-action
          data-testid="link-resolve"
          href={`/debt-balances/${debt.compositeDebtId}/resolve`}
          onClick={event => {
            event.preventDefault();
            recordEvent({ event: 'cta-link-click-debt-details-card' });
            history.push(`/debt-balances/${debt.compositeDebtId}/resolve`);
          }}
          text="Resolve this overpayment"
          type="primary"
        />
      )}
    </va-alert>
  ) : (
    <va-alert
      class="vads-u-margin-bottom--1"
      disable-analytics="false"
      full-width="false"
      status={debtCardContent.status}
      visible="true"
    >
      <h2 slot="headline">{debtCardContent.headerText}</h2>

      {debtCardContent.bodyText}

      {debtCardContent.showLinks && (
        <>
          {debtCardContent.showMakePayment && (
            <p className="vads-u-margin-y--0">
              <va-link-action
                aria-label="Make a payment"
                data-testid="link-make-payment"
                href="https://www.pay.va.gov/"
                onClick={() => {
                  recordEvent({ event: 'cta-link-click-debt-make-payment' });
                }}
                type="secondary"
                text="Make a payment"
              />
            </p>
          )}
          {debtCardContent.showRequestHelp && (
            <p className="vads-u-margin-y--0">
              <va-link-action
                aria-label="Request help with your debt"
                data-testid="link-request-help"
                href="/manage-va-debt/request-debt-help-form-5655"
                onClick={() => {
                  recordEvent({ event: 'cta-link-click-debt-request-help' });
                }}
                type="secondary"
                text="Request help with your debt"
              />
            </p>
          )}
        </>
      )}
    </va-alert>
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
