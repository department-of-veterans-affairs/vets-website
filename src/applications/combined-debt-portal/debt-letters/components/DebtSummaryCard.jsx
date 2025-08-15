import React from 'react';
import { useDispatch } from 'react-redux';
import head from 'lodash/head';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { deductionCodes } from '../const/deduction-codes';
import { setActiveDebt } from '../../combined/actions/debts';
import { currency } from '../utils/page';
import { debtSummaryText } from '../const/diary-codes/debtSummaryCardContent';

// Define the Post-9/11 GI Bill housing debt codes
const HOUSING_DEBT_CODES = [
  '16',
  '17',
  '18',
  '19',
  '20',
  '48',
  '49',
  '50',
  '51',
  '72',
];

const DebtSummaryCard = ({ debt }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showResolveLinks = useToggleValue(TOGGLE_NAMES.showCDPOneThingPerPage);
  const dispatch = useDispatch();
  const mostRecentHistory = head(debt?.debtHistory);
  const debtCardTotal = currency.format(parseFloat(debt.currentAr));
  const debtCardHeading =
    deductionCodes[debt.deductionCode] || debt.benefitType;
  const debtCardSubHeading = debtSummaryText(
    debt.diaryCode,
    mostRecentHistory?.date,
    debtCardTotal,
  );

  // Check if the debt is a Post-9/11 GI Bill housing debt
  const isHousingDebt = HOUSING_DEBT_CODES.includes(debt.deductionCode);

  return (
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

      {/* Housing debt specific note */}
      {isHousingDebt && (
        <p className="vads-u-margin-top--2 vads-u-margin-bottom--2">
          <strong>Note:</strong> As of August 5, 2025, we now add an ID number
          (called a "receivable ID") to each VA education debt letter. You’ll
          need this number instead of your VA file number or Social Security
          number to process a payment. Questions? Call us at{' '}
          <va-telephone contact="8008270648" />. We’re here Monday through
          Friday, 7:30 a.m. to 7:00 p.m. ET.
        </p>
      )}

      {showResolveLinks ? (
        <>
          <VaLink
            active
            data-testid="debt-details-link"
            onClick={() => {
              recordEvent({ event: 'cta-link-click-debt-summary-card' });
              dispatch(setActiveDebt(debt));
            }}
            href={`/manage-va-debt/summary/debt-balances/details/${
              debt.compositeDebtId
            }`}
            text="Review details"
            aria-label={`Check details for ${debtCardHeading}`}
          />
          <div className="vads-u-margin-top--1">
            <VaLink
              active
              data-testid="debt-resolve-link"
              onClick={() => {
                recordEvent({ event: 'cta-link-click-debt-summary-card' });
                dispatch(setActiveDebt(debt));
              }}
              href={`/manage-va-debt/summary/debt-balances/details/${
                debt.compositeDebtId
              }/resolve`}
              text="Resolve this debt"
              aria-label={`Resolve ${debtCardHeading}`}
            />
          </div>
        </>
      ) : (
        <>
          <VaLink
            active
            data-testid="debt-details-button"
            onClick={() => {
              recordEvent({ event: 'cta-link-click-debt-summary-card' });
              dispatch(setActiveDebt(debt));
            }}
            href={`/manage-va-debt/summary/debt-balances/details/${
              debt.compositeDebtId
            }`}
            text="Check details and resolve this debt"
            label={`Check details and resolve this ${debtCardHeading}`}
          />
        </>
      )}
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
    compositeDebtId: PropTypes.string,
  }),
};

export default DebtSummaryCard;
