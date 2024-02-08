import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import last from 'lodash/last';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import HowDoIPay from '../components/HowDoIPay';
import NeedHelp from '../components/NeedHelp';
import OnThisPageLinks from '../components/OnThisPageLinks';
import '../sass/debt-letters.scss';
import HistoryTable from '../components/HistoryTable';
import { getCurrentDebt } from '../utils/page';
import { setPageFocus } from '../../combined/utils/helpers';
import {
  deductionCodes,
  renderWhyMightIHaveThisDebt,
} from '../const/deduction-codes';
import DebtDetailsCard from '../components/DebtDetailsCard';

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

  const howToUserData = {
    fileNumber: currentDebt.fileNumber,
    payeeNumber: currentDebt.payeeNumber,
    personEntitled: currentDebt.personEntitled,
    deductionCode: currentDebt.deductionCode,
  };

  useEffect(() => {
    setPageFocus('h1');
  }, []);

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
      <div className="vads-l-col--9 small-desktop-screen:vads-l-col--12">
        <VaBreadcrumbs
          breadcrumbList={[
            {
              href: '/',
              label: 'Home',
            },
            {
              href: '/manage-va-debt',
              label: 'Manage your VA debt',
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
              href: `/manage-va-debt/summary/debt-balances/details/${selectedDebt.fileNumber +
                selectedDebt.deductionCode}`,
              label: 'Debt details',
            },
          ]}
          className="vads-u-font-family--sans no-wrap"
          label="Breadcrumb"
          uswds
        />
      </div>
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1
          className="vads-u-font-family--serif vads-u-margin-bottom--2"
          tabIndex="-1"
        >
          Your {deductionCodes[currentDebt.deductionCode]}
        </h1>
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-font-family--sans">
          {dateUpdated && (
            <p className="va-introtext">
              Updated on
              <span className="vads-u-margin-left--0p5">
                {moment(dateUpdated, 'MM-DD-YYYY').format('MMMM D, YYYY')}
              </span>
            </p>
          )}
          <DebtDetailsCard debt={currentDebt} />
          {whyContent && (
            <va-additional-info trigger="Why might I have this debt?" uswds>
              {whyContent}
            </va-additional-info>
          )}
          <OnThisPageLinks isDetailsPage hasHistory={hasFilteredHistory} />
          {hasFilteredHistory && (
            <>
              <h2
                id="debtLetterHistory"
                className="vads-u-margin-top--5 vads-u-margin-bottom--0"
              >
                Debt letter history
              </h2>
              <p className="vads-u-margin-y--2">
                You can check the status or download the letters for this debt.
              </p>
              <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
                <strong>Note:</strong> The content of the debt letters below may
                not include recent updates to your debt reflected above. If you
                have any questions about your debt history, please contact the
                Debt Management Center at{' '}
                <va-telephone
                  className="vads-u-margin-left--0p5"
                  contact="8008270648"
                />
                .
              </p>
              <HistoryTable history={filteredHistory} />
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
          )}
          <HowDoIPay userData={howToUserData} />
          <NeedHelp />
        </div>
      </div>
    </>
  );
};

export default DebtDetails;
