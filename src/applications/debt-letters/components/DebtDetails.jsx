import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import {
  deductionCodes,
  renderWhyMightIHaveThisDebt,
} from '../const/deduction-codes';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';
import { OnThisPageLinks } from './OnThisPageLinks';
import moment from 'moment';
import head from 'lodash/head';
import last from 'lodash/last';
import first from 'lodash/first';
import { Link } from 'react-router';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import {
  renderAdditionalInfo,
  renderLetterHistory,
} from '../const/diary-codes';

import { setPageFocus } from '../utils/page';

class DebtDetails extends Component {
  componentDidMount() {
    scrollToTop();
    setPageFocus('h1');
  }
  render() {
    const { selectedDebt } = this.props;
    const mostRecentHistory = head(selectedDebt.debtHistory);
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    const letterCodes = ['100', '101', '102', '109', '117', '123', '130'];

    const filteredHistory = selectedDebt.debtHistory
      .filter(history => letterCodes.includes(history.letterCode))
      .reverse();

    const hasFilteredHistory = filteredHistory.length > 0;

    if (Object.keys(selectedDebt).length === 0) {
      return window.location.replace('/manage-va-debt/your-debt');
    }

    const additionalInfo = renderAdditionalInfo(
      selectedDebt.diaryCode,
      mostRecentHistory.date,
      selectedDebt.benefitType,
    );

    const whyMightIHaveThisDebtContent = renderWhyMightIHaveThisDebt(
      selectedDebt.deductionCode,
    );

    const renderHistoryTable = history => {
      if (hasFilteredHistory) {
        return (
          <table className="vads-u-margin-y--4">
            <thead>
              <tr>
                <th className="vads-u-font-weight--bold" scope="col">
                  Date
                </th>
                <th className="vads-u-font-weight--bold" scope="col">
                  Letter
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((debtEntry, index) => (
                <tr key={`${debtEntry.date}-${index}`}>
                  <td>{moment(debtEntry.date).format('MMMM D, YYYY')}</td>
                  <td>
                    <div className="vads-u-margin-top--0">
                      {renderLetterHistory(debtEntry.letterCode)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      return null;
    };

    return (
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <Breadcrumbs className="vads-u-font-family--sans">
          <a href="/">Home</a>
          <a href="/manage-va-debt">Manage your VA debt</a>
          <a href="/manage-va-debt/your-debt">Your VA debt</a>
          <a href="/manage-va-debt/your-debt/debt-detail">Details</a>
        </Breadcrumbs>
        <h1
          className="vads-u-font-family--serif vads-u-margin-bottom--2"
          tabIndex="-1"
        >
          Your {deductionCodes[selectedDebt.deductionCode]}
        </h1>
        <div className="vads-l-row">
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-right--2p5 vads-l-col--12 medium-screen:vads-l-col--8 vads-u-font-family--sans">
            <p className="va-introtext vads-u-margin-top--0">
              Updated on{' '}
              {moment(last(selectedDebt.debtHistory).date).format(
                'MMMM D, YYYY',
              )}
            </p>
            <div className="vads-u-display--flex vads-u-flex-direction--row">
              <dl className="vads-u-display--flex vads-u-flex-direction--column">
                <div className="vads-u-margin-y--1 vads-u-display--flex">
                  <dt>
                    <strong>Date of first notice: </strong>
                  </dt>
                  <dd className="vads-u-margin-left--1">
                    {moment(first(selectedDebt.debtHistory).date).format(
                      'MMMM D, YYYY',
                    )}
                  </dd>
                </div>
                <div className="vads-u-display--flex ">
                  <dt>
                    <strong>Original debt amount: </strong>
                  </dt>
                  <dd className="vads-u-margin-left--1">
                    {formatter.format(parseFloat(selectedDebt.originalAr))}
                  </dd>
                </div>
                <div className="vads-u-margin-y--1 vads-u-display--flex">
                  <dt>
                    <strong>Current balance: </strong>
                  </dt>
                  <dd className="vads-u-margin-left--1">
                    {formatter.format(parseFloat(selectedDebt.currentAr))}
                  </dd>
                </div>
              </dl>
            </div>

            <AlertBox
              className="vads-u-margin-y--4 debt-details-alert"
              status="info"
              backgroundOnly
            >
              {additionalInfo.nextStep}
            </AlertBox>

            {whyMightIHaveThisDebtContent && (
              <AdditionalInfo triggerText="Why might I have this debt?">
                {whyMightIHaveThisDebtContent}
              </AdditionalInfo>
            )}
            <OnThisPageLinks isDetailsPage />

            <h2
              id="debtLetterHistory"
              className="vads-u-margin-top--5 vads-u-margin-bottom--0"
            >
              Debt letter history
            </h2>
            <p className="vads-u-margin-y--2">
              You can view the status or download the letters for this debt.
            </p>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              <strong>Note:</strong> The content of the debt letters below may
              not include recent updates to your debt reflected above. If you
              have any questions about your debt history, please contact the
              Debt Management Center at <Telephone contact="8008270648" />
              {'.'}
            </p>
            {renderHistoryTable(filteredHistory)}
            <h3 id="downloadDebtLetters" className="vads-u-margin-top--0">
              Download debt letters
            </h3>
            <p className="vads-u-margin-bottom--0">
              You can download some of your letters for education, compensation
              and pension debt.
            </p>
            <Link to="debt-letters" className="vads-u-margin-top--1">
              Download letters related to your VA debt
            </Link>
            <HowDoIPay />
            <NeedHelp />
            <Link className="vads-u-margin-top--4" to="/">
              <i className="fa fa-chevron-left" /> Return to your list of debts.
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedDebt: state.debtLetters?.selectedDebt,
});

DebtDetails.propTypes = {
  selectedDebt: PropTypes.object.isRequired,
};

DebtDetails.propTypes = {
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
