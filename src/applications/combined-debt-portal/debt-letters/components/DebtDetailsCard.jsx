import React from 'react';
import { head } from 'lodash';
import PropTypes from 'prop-types';
// import { deductionCodes } from '../const/deduction-codes';
// import { setActiveDebt } from '../../combined/actions/debts';
import { format, isValid } from 'date-fns';
import { getDebtDetailsCardContent } from '../const/diary-codes/debtDetailsCardContent';
import { currency } from '../utils/page';
import recordEvent from '~/platform/monitoring/record-event';

const DebtDetailsCard = ({ debt }) => {
  // TODO: currently we do not have a debtID so we need to make one by combining fileNumber and diaryCode
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

  return (
    <va-alert
      background-only
      class="vads-u-margin-bottom--1"
      disable-analytics="false"
      full-width="false"
      show-icon={debtCardContent.showIcon}
      status={debtCardContent.status}
      visible="true"
      uswds
    >
      <h2 className="vads-u-margin--0">{debtCardContent.headerText}</h2>

      <div>
        <div className="vads-u-margin-y--2 vads-u-font-size--md vads-u-font-family--sans">
          {debtCardContent.bodyText}
        </div>
      </div>

      {debtCardContent.showLinks && (
        <div className="vads-u-margin-y--2">
          {debtCardContent.showMakePayment && (
            <div>
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
            </div>
          )}
          {debtCardContent.showRequestHelp && (
            <div>
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
            </div>
          )}
        </div>
      )}
    </va-alert>
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
    fileNumber: PropTypes.string,
  }),
};

export default DebtDetailsCard;
