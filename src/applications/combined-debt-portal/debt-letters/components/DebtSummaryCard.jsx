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
            label={`Check details for ${debtCardHeading}`}
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
              label={`Resolve ${debtCardHeading}`}
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
