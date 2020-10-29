import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { deductionCodes } from '../const/deduction-codes';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';
import { OnThisPageLinks } from './OnThisPageLinks';
import moment from 'moment';
import head from 'lodash/head';
import last from 'lodash/last';
import first from 'lodash/first';
import { Link } from 'react-router';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';
import { renderAdditionalInfo } from '../const/diary-codes';

class DebtDetails extends Component {
  componentDidMount() {
    scrollToTop();
  }
  render() {
    const { selectedDebt } = this.props;
    const mostRecentHistory = head(selectedDebt.debtHistory);
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    if (Object.keys(selectedDebt).length === 0) {
      return window.location.replace('/manage-va-debt/your-debt');
    }

    const additionalInfo = renderAdditionalInfo(
      selectedDebt.diaryCode,
      mostRecentHistory.date,
    );

    return (
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <Breadcrumbs className="vads-u-font-family--sans">
          <a href="/">Home</a>
          <a href="/manage-va-debt">Manage your VA debt</a>
          <a href="/manage-va-debt/your-debt">Your VA debt</a>
          <a href="/manage-va-debt/your-debt/debt-detail">Details</a>
        </Breadcrumbs>
        <h1 className="vads-u-font-family--serif vads-u-margin-bottom--2">
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
              <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-margin-right--2">
                <p className="vads-u-margin-y--0 vads-u-font-weight--bold">
                  Date of first notice:
                </p>
                <p className="vads-u-margin-y--1 vads-u-font-weight--bold">
                  Original debt amount:
                </p>
                <p className="vads-u-margin-y--0 vads-u-font-weight--bold">
                  Current balance:
                </p>
              </div>
              <div className="vads-u-display--flex vads-u-flex-direction--column">
                <p className="vads-u-margin-y--0">
                  {moment(first(selectedDebt.debtHistory).date).format(
                    'MMMM D, YYYY',
                  )}
                </p>
                <p className="vads-u-margin-y--1">
                  {formatter.format(parseFloat(selectedDebt.originalAr))}
                </p>
                <p className="vads-u-margin-y--0">
                  {formatter.format(parseFloat(selectedDebt.currentAr))}
                </p>
              </div>
            </div>

            {additionalInfo &&
              (additionalInfo.nextStep ? (
                <div className="debt-details-nextstep">
                  {additionalInfo.nextStep}
                </div>
              ) : (
                additionalInfo.headline && (
                  <AlertBox
                    className="vads-u-margin-y--4 debt-details-alert"
                    headline={additionalInfo.headline}
                    content={additionalInfo.content}
                    status="info"
                    level={2}
                  />
                )
              ))}

            <AdditionalInfo triggerText="Why might I have this debt?">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi
              excepturi fugit non sunt. Asperiores autem error ipsam magnam
              minus modi nam obcaecati quasi, ratione rem repellendus
              reprehenderit ut veritatis vitae.
            </AdditionalInfo>
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
            <table className="vads-u-margin-y--4">
              <thead>
                <tr>
                  <td className="vads-u-font-weight--bold">Date</td>
                  <td className="vads-u-font-weight--bold">Letter</td>
                </tr>
              </thead>
              <tbody>
                {selectedDebt.debtHistory.map((debtEntry, index) => (
                  <tr key={`${debtEntry.date}-${index}`}>
                    <td>{moment(debtEntry.date).format('MMMM D, YYYY')}</td>
                    <td>
                      <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
                        {debtEntry.status}
                      </p>
                      <p className="vads-u-margin-top--0">
                        {debtEntry.description}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
