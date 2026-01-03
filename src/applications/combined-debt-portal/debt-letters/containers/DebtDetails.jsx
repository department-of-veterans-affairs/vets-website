import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import last from 'lodash/last';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { head } from 'lodash';
import HistoryTable from '../components/HistoryTable';
import {
  setPageFocus,
  debtLettersShowLettersVBMS,
  showPaymentHistory,
  formatDate,
} from '../../combined/utils/helpers';
import { getCurrentDebt, currency } from '../utils/page';
import {
  deductionCodes,
  renderWhyMightIHaveThisDebt,
} from '../const/deduction-codes';
import DebtDetailsCard from '../components/DebtDetailsCard';
import PaymentHistoryTable from '../components/PaymentHistoryTable';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';
import Modals from '../../combined/components/Modals';
import NeedHelp from '../components/NeedHelp';

const DebtDetails = () => {
  const { selectedDebt, debts } = useSelector(
    ({ combinedPortal }) => combinedPortal.debtLetters,
  );
  const approvedLetterCodes = ['100', '101', '102', '109', '117', '123', '130'];
  const location = useLocation();
  const currentDebt = getCurrentDebt(selectedDebt, debts, location);

  const whyContent = renderWhyMightIHaveThisDebt(currentDebt.deductionCode);
  const dateUpdated = last(currentDebt.debtHistory)?.date;

  const filteredHistory = currentDebt.debtHistory
    ?.filter(history => approvedLetterCodes.includes(history.letterCode))
    .reverse();
  const hasFilteredHistory = filteredHistory && filteredHistory.length > 0;

  const title = `${deductionCodes[currentDebt.deductionCode]}`;
  useHeaderPageTitle(title);

  const showDebtLetterDownload = useSelector(state =>
    debtLettersShowLettersVBMS(state),
  );

  const formatCurrency = amount => currency.format(parseFloat(amount));

  const getLatestPaymentDateFromCurrentDebt = debt => {
    const mostRecentDate = head(debt.fiscalTransactionData)?.transactionDate;

    if (mostRecentDate === '') return 'N/A';

    return mostRecentDate;
  };

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  const shouldShowPaymentHistory = useSelector(state =>
    showPaymentHistory(state),
  );

  if (Object.keys(currentDebt).length === 0) {
    window.location.replace('/manage-va-debt/summary/debt-balances/');
    return (
      <va-loading-indicator
        label="Loading"
        message="Please wait while we load the application for you."
      />
    );
  }

  return (
    <article>
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'Home',
          },
          {
            href: '/manage-va-debt/summary',
            label: 'Overpayments and copay bills',
          },
          {
            href: '/manage-va-debt/summary/debt-balances',
            label: 'Overpayment balances',
          },
          {
            href: `/manage-va-debt/summary/debt-balances/${
              selectedDebt.compositeDebtId
            }`,
            label: `${title}`,
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 className="vads-u-margin-bottom--2" tabIndex="-1">
          {title}
        </h1>
        {dateUpdated && (
          <p className="va-introtext">
            Updated on
            <span className="vads-u-margin-left--0p5">
              {formatDate(dateUpdated)}
            </span>
            .
          </p>
        )}
        <DebtDetailsCard debt={currentDebt} />
        <va-accordion open-single>
          <va-accordion-item
            header="Why might I have this overpayment balance?"
            id="first"
            bordered
          >
            {whyContent}
          </va-accordion-item>
        </va-accordion>
        {shouldShowPaymentHistory ? (
          <div className="vads-u-margin-y--2">
            <h2
              id="debtDetailsHeader"
              className="vads-u-margin-y--2 vads-u-margin-top--4"
              data-testid="debt-details-header"
            >
              Overpayment details
            </h2>
            <div className="mobile-lg:vads-u-display--flex small-screen:vads-u-justify-content--space-between medium-screen:vads-u-max-width--90">
              <div>
                <h3 className="vads-u-margin-y--0">
                  <span className="vads-u-display--block vads-u-font-size--base vads-u-font-weight--normal">
                    Current balance as of{' '}
                    {formatDate(
                      getLatestPaymentDateFromCurrentDebt(currentDebt),
                    )}
                  </span>
                  <span className="vads-u-margin-y--0 medium-screen:vads-u-font-size--h3">
                    {formatCurrency(currentDebt.currentAr)}
                  </span>
                </h3>
              </div>
              <div className="debt-balance-details mobile-lg:vads-u-margin-top--0">
                <h3 className="vads-u-margin-y--0">
                  <span className="vads-u-display--block vads-u-font-size--base vads-u-font-weight--normal">
                    Original overpayment amount
                  </span>
                  <span className="vads-u-margin-y--0 medium-screen:vads-u-font-size--h3">
                    {formatCurrency(currentDebt.originalAr)}
                  </span>
                </h3>
              </div>
            </div>
            <PaymentHistoryTable currentDebt={currentDebt} />
          </div>
        ) : (
          <>
            <h2
              id="debtDetailsHeader"
              className="vads-u-margin-y--2 vads-u-margin-top--4"
              data-testid="otpp-details-header"
            >
              Overpayment details
            </h2>
            <p>
              <span className="vads-u-display--block vads-u-font-size--base vads-u-font-weight--normal">
                Current balance:{' '}
                <strong>{formatCurrency(currentDebt.currentAr)}</strong>
              </span>
              <span className="vads-u-display--block vads-u-font-size--base vads-u-font-weight--normal">
                Original amount:{' '}
                <strong>{formatCurrency(currentDebt.originalAr)}</strong>
              </span>
            </p>
          </>
        )}
        {hasFilteredHistory && (
          <>
            <h2
              id="debtLetterHistory"
              className="vads-u-margin-top--4 vads-u-margin-bottom--0"
            >
              Overpayment letter history
            </h2>
            <HistoryTable history={filteredHistory} />
            {showDebtLetterDownload ? (
              <>
                <h3 id="downloadDebtLetters" className="vads-u-margin-top--0">
                  Download debt letters
                </h3>
                <p className="vads-u-margin-bottom--0">
                  You can download some of your letters for education,
                  compensation and pension debt.
                </p>
                <Link
                  to="/debt-balances/letters"
                  className="vads-u-margin-top--1"
                >
                  Download letters related to your VA debt
                </Link>
              </>
            ) : null}
          </>
        )}
        <Modals title="Notice of rights and responsibilities" id="notice-modal">
          <Modals.Rights />
        </Modals>
        <NeedHelp />
      </div>
    </article>
  );
};

export default DebtDetails;
