import React, { Component } from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';
import { OnThisPageLinks } from './OnThisPageLinks';
import DebtCardsList from './DebtCardsList';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

class DebtLettersSummary extends Component {
  componentDidMount() {
    scrollToTop();
  }

  render() {
    const renderAlert = () => (
      <div
        className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
        role="alert"
      >
        <div className="usa-alert-body">
          <h3 className="usa-alert-heading">
            We're sorry. Something went wrong on our end.
          </h3>
          <p className="vads-u-font-family--sans">
            You can't view information about your current debts or download your
            debt letters because something went wrong on our end.
          </p>
          <h4>What you can do</h4>
          <p className="vads-u-font-family--sans vads-u-margin-y--0">
            If you need help resolving debt, or you would like to get
            information about a debt that has been resolved, call the Debt
            Management Center at <Telephone contact="8008270648" />
            {'.'}
          </p>
        </div>
      </div>
    );

    const renderEmptyAlert = () => (
      <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3">
        <h2 className="vads-u-font-family--serif vads-u-margin-top--0 vads-u-font-size--h4">
          Our records show that you don't have any current debts
        </h2>
        <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
          If you believe that you have a debt with the VA, call the Debt
          Management Center at <Telephone contact="8008270648" />
          {'.'}
        </p>
        <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
          For medical copayment debts, visit{' '}
          <a href="/health-care/pay-copay-bill/">Pay your VA copay bill</a> to
          learn about your payment options.
        </p>
      </div>
    );

    const { isError, isVBMSError, debts, debtLinks } = this.props;
    const allDebtsFetchFailure = isVBMSError && isError;
    const allDebtsEmpty =
      !allDebtsFetchFailure && debts.length === 0 && debtLinks.length === 0;
    return (
      <>
        <Breadcrumbs className="vads-u-font-family--sans">
          <a href="/">Home</a>
          <a href="/manage-va-debt">Manage your VA debt</a>
          <a href="/manage-va-debt/your-debt">Your VA debt</a>
        </Breadcrumbs>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <h1 className="vads-u-padding-x--2p5 vads-u-margin-bottom--2">
            Current VA debt
          </h1>
          <div className="vads-u-display--block">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
              <p className="va-introtext vads-u-margin-top--0 vads-u-margin-bottom--2">
                Check the details of VA debt you might have related to your
                education, disability compensation, or pension benefits. Find
                out how to pay your debt and what to do if you need financial
                assistance.
              </p>
              {allDebtsFetchFailure && renderAlert()}
              {allDebtsEmpty && renderEmptyAlert()}
              {!allDebtsFetchFailure && (
                <>
                  <OnThisPageLinks />
                  <DebtCardsList />
                </>
              )}
              <HowDoIPay />
              <NeedHelp />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  isVBMSError: state.debtLetters.isVBMSError,
  isError: state.debtLetters.isError,
  debtLinks: state.debtLetters.debtLinks,
  debts: state.debtLetters.debts,
});

DebtLettersSummary.propTypes = {
  isVBMSError: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  debtLinks: PropTypes.arrayOf(
    PropTypes.shape({
      documentId: PropTypes.string,
      receivedAt: PropTypes.string,
      typeDescription: PropTypes.string,
    }),
  ),
  debts: PropTypes.arrayOf(
    PropTypes.shape({
      fileNumber: PropTypes.string,
    }),
  ),
};

DebtLettersSummary.defaultProps = {
  isVBMSError: false,
  isError: false,
  debtLinks: [],
  debts: [],
};

export default connect(mapStateToProps)(DebtLettersSummary);
