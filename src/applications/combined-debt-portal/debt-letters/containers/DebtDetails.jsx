import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import last from 'lodash/last';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { head } from 'lodash';
import HowDoIPay from '../components/HowDoIPay';
import NeedHelp from '../components/NeedHelp';
import DebtDetailsOnThisPageLinks from '../components/DebtDetailsOnThisPageLinks';
import HistoryTable from '../components/HistoryTable';
import {
  setPageFocus,
  debtLettersShowLettersVBMS,
  showPaymentHistory,
} from '../../combined/utils/helpers';
import { getCurrentDebt, currency } from '../utils/page';
import {
  deductionCodes,
  renderWhyMightIHaveThisDebt,
} from '../const/deduction-codes';
import DebtDetailsCard from '../components/DebtDetailsCard';
import PaymentHistoryTable from '../components/PaymentHistoryTable';

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
  const hasPaymentHistory =
    currentDebt.fiscalTransactionData &&
    currentDebt.fiscalTransactionData.length > 0;

  const howToUserData = {
    fileNumber: currentDebt.fileNumber,
    payeeNumber: currentDebt.payeeNumber,
    personEntitled: currentDebt.personEntitled,
    deductionCode: currentDebt.deductionCode,
  };

  const showDebtLetterDownload = useSelector(state =>
    debtLettersShowLettersVBMS(state),
  );

  const formatCurrency = amount => currency.format(parseFloat(amount));

  const getLatestPaymentDateFromCurrentDebt = debt => {
    const mostRecentDate = head(debt.fiscalTransactionData)?.transactionDate;

    if (mostRecentDate === '') return 'N/A';

    return mostRecentDate;
  };

  const getFirstPaymentDateFromCurrentDebt = debt => {
    const firstPaymentDate = last(debt.fiscalTransactionData)?.transactionDate;

    if (firstPaymentDate === '') return 'N/A';

    return firstPaymentDate;
  };

  currentDebt.firstPaymentDate = getFirstPaymentDateFromCurrentDebt(
    currentDebt,
  );

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
    <>
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'Home',
          },
          {
            href: '/manage-va-debt/summary',
            label: 'Your VA debt and bills',
          },
          {
            href: '/manage-va-debt/summary/debt-balances',
            label: 'Current VA debt',
          },
          {
            href: `/manage-va-debt/summary/debt-balances/details/${
              selectedDebt.compositeDebtId
            }`,
            label: 'Debt details',
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 className="vads-u-margin-bottom--2" tabIndex="-1">
          Your {deductionCodes[currentDebt.deductionCode]}
        </h1>
        {dateUpdated && (
          <p className="va-introtext">
            Updated on
            <span className="vads-u-margin-left--0p5">
              {moment(dateUpdated, 'MM-DD-YYYY').format('MMMM D, YYYY')}
            </span>
            . Payments after this date will not be reflected here.
          </p>
        )}
        <DebtDetailsCard debt={currentDebt} />
        {whyContent && (
          <va-additional-info
            trigger="Why might I have this debt?"
            class="vads-u-margin-y--2"
          >
            {whyContent}
          </va-additional-info>
        )}
        <DebtDetailsOnThisPageLinks
          isDetailsPage
          hasHistory={hasFilteredHistory}
          hasPaymentHistory={hasPaymentHistory}
          showDebtLetterDownload={showDebtLetterDownload}
          shouldShowPaymentHistory={shouldShowPaymentHistory}
        />
        {shouldShowPaymentHistory && (
          <div>
            <h2 id="debtDetailsHeader" className="vads-u-margin-y--2">
              Debt details
            </h2>
            <div className="small-screen:vads-u-display--flex small-screen:vads-u-justify-content--space-between medium-screen:vads-u-max-width--90">
              <div>
                <h3 className="vads-u-margin-y--0">
                  <span className="vads-u-display--block vads-u-font-size--base vads-u-font-weight--normal">
                    Current balance as of{' '}
                    {getLatestPaymentDateFromCurrentDebt(currentDebt)}
                  </span>
                  <span className="vads-u-margin-y--0 medium-screen:vads-u-font-size--h2">
                    {formatCurrency(currentDebt.currentAr)}
                  </span>
                </h3>
              </div>
              <div className="vads-u-margin-top--2 small-screen:vads-u-margin-top--0">
                <h3 className="vads-u-margin-y--0">
                  <span className="vads-u-display--block vads-u-font-size--base vads-u-font-weight--normal">
                    Original overpayment amount
                  </span>
                  <span className="vads-u-margin-y--0 medium-screen:vads-u-font-size--h2">
                    {formatCurrency(currentDebt.originalAr)}
                  </span>
                </h3>
              </div>
            </div>
            <PaymentHistoryTable currentDebt={currentDebt} />
          </div>
        )}
        {hasFilteredHistory && (
          <>
            <h2
              id="debtLetterHistory"
              className="vads-u-margin-top--5 vads-u-margin-bottom--0"
            >
              Debt letter history
            </h2>
            <p className="vads-u-margin-bottom--0">
              {`You can check the status ${
                showDebtLetterDownload ? `or download the letters for` : `of`
              } this debt.`}
            </p>
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
        <HowDoIPay userData={howToUserData} />
        <NeedHelp />
      </div>
    </>
  );
};

export default DebtDetails;
