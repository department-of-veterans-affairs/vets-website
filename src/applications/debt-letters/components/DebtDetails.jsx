import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import head from 'lodash/head';
import last from 'lodash/last';
import first from 'lodash/first';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';
import { setPageFocus, getCurrentDebt, currency } from '../utils/page';
import OnThisPageLinks from './OnThisPageLinks';
import { renderAdditionalInfo } from '../const/diary-codes';
import HistoryTable from './HistoryTable';
import {
  deductionCodes,
  renderWhyMightIHaveThisDebt,
} from '../const/deduction-codes';

const DebtDetails = ({ selectedDebt, debts }) => {
  const approvedLetterCodes = ['100', '101', '102', '109', '117', '123', '130'];
  const location = useLocation();
  const currentDebt = getCurrentDebt(selectedDebt, debts, location);
  const mostRecentHistory = head(currentDebt?.debtHistory);
  const whyContent = renderWhyMightIHaveThisDebt(currentDebt.deductionCode);
  const dateUpdated = last(currentDebt.debtHistory)?.date;
  const dateFirstNotice = first(currentDebt.debtHistory)?.date;
  const filteredHistory = currentDebt.debtHistory
    ?.filter(history => approvedLetterCodes.includes(history.letterCode))
    .reverse();
  const hasFilteredHistory = filteredHistory && filteredHistory.length > 0;
  const additionalInfo = renderAdditionalInfo(
    currentDebt.diaryCode,
    mostRecentHistory?.date,
    currentDebt.benefitType,
  );

  useEffect(() => {
    scrollToTop();
    setPageFocus('h1');
  }, []);

  if (Object.keys(currentDebt).length === 0) {
    window.location.replace('/manage-va-debt/your-debt');
    return (
      <div className="vads-u-font-family--sans vads-u-margin--0 vads-u-padding--1">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          set-focus
        />
      </div>
    );
  }

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <VaBreadcrumbs label="Breadcrumb">
        <a href="/">Home</a>
        <a href="/manage-va-debt">Manage your VA debt</a>
        <a href="/manage-va-debt/your-debt">Your VA debt</a>
        <a href="/manage-va-debt/your-debt/debt-detail">Details</a>
      </VaBreadcrumbs>
      <h1
        className="vads-u-font-family--serif vads-u-margin-bottom--2"
        tabIndex="-1"
      >
        Your {deductionCodes[currentDebt.deductionCode]}
      </h1>
      <section className="vads-l-row">
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-right--2p5 vads-l-col--12 medium-screen:vads-l-col--8 vads-u-font-family--sans">
          {dateUpdated && (
            <p className="va-introtext vads-u-margin-top--0">
              Updated on
              <span className="vads-u-margin-left--0p5">
                {moment(dateUpdated, 'MM-DD-YYYY').format('MMMM D, YYYY')}
              </span>
            </p>
          )}
          <dl className="details-table">
            <div className="details-row">
              <dt className="details-title">Amount owed:</dt>
              <dd className="details-data">
                {currency.format(parseFloat(currentDebt.currentAr))}
              </dd>
            </div>
            <div className="details-row">
              <dt className="details-title">Original amount:</dt>
              <dd className="details-data">
                {currency.format(parseFloat(currentDebt.originalAr))}
              </dd>
            </div>
            {dateFirstNotice && (
              <div className="details-row">
                <dt className="details-title">Date of first notice:</dt>
                <dd className="details-data">
                  {moment(dateFirstNotice, 'MM-DD-YYYY').format('MMMM D, YYYY')}
                </dd>
              </div>
            )}
            <div className="details-row">
              <dt className="details-title">Collection status:</dt>
              <dd className="details-data">{additionalInfo.status}</dd>
            </div>
          </dl>
          <va-alert
            status="info"
            class="vads-u-margin-bottom--4 vads-u-font-size--base"
            background-only
          >
            {additionalInfo.nextStep}
          </va-alert>
          {whyContent && (
            <va-additional-info trigger="Why might I have this debt?">
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
              <Link to="/debt-letters" className="vads-u-margin-top--1">
                Download letters related to your VA debt
              </Link>
            </>
          )}
          <HowDoIPay />
          <NeedHelp />
          <Link className="vads-u-margin-top--4" to="/">
            <i aria-hidden="true" className="fa fa-chevron-left" /> Return to
            your list of debts.
          </Link>
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = ({ debtLetters }) => ({
  selectedDebt: debtLetters?.selectedDebt,
  debts: debtLetters.debts,
});

DebtDetails.defaultProps = {
  selectedDebt: {
    debtHistory: [],
  },
};

DebtDetails.propTypes = {
  debts: PropTypes.array,
  selectedDebt: PropTypes.shape({
    currentAr: PropTypes.number,
    debtHistory: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
      }),
    ),
    deductionCode: PropTypes.string,
    originalAr: PropTypes.number,
  }),
};

export default connect(mapStateToProps)(DebtDetails);
