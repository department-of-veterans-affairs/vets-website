import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';
import DebtCardsList from './DebtCardsList';
import DebtLettersList from './DebtLettersList';

const DebtLettersSummaryV1 = ({ isError, isVBMSError, debts, debtLinks }) => {
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
        <p className="vads-u-margin-bottom--1">
          <strong>What you can do</strong>
        </p>
        <p className="vads-u-font-family--sans vads-u-margin-y--0">
          If you need help resolving debt, or you would like to get information
          about a debt that has been resolved, call the Debt Management Center
          at{' '}
          <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
            800-827-0648
          </a>
          {'.'}
        </p>
      </div>
    </div>
  );

  const renderEmptyAlert = () => (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3">
      <h4 className="vads-u-font-family--serif vads-u-margin-top--0">
        Our records show that you don't have any current debts
      </h4>
      <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
        If you believe that you have a debt with the VA, call the Debt
        Management Center at{' '}
        <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
          800-827-0648
        </a>
        {'.'}
      </p>
      <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
        For medical copayment debts, visit{' '}
        <a href="/health-care/pay-copay-bill/">Pay your VA copay bill</a> to
        learn about your payment options.
      </p>
    </div>
  );

  const bannerContent = (
    <>
      <p>
        We’ve taken action to stop collection on newly established Veteran debt
        and make it easier for Veterans to request extended repayment plans and
        address other financial needs during this time.
      </p>
      <p>
        You won’t receive any debt collection letters in the mail until after
        December 31, 2020. For the latest information about managing VA debt,
        visit our{' '}
        <a href="http://va.gov/coronavirus-veteran-frequently-asked-questions/">
          coronavirus FAQs
        </a>
        .
      </p>
    </>
  );

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
        <div className="medium-screen:vads-u-display--flex vads-u-flex-direction--row vads-u-display--block">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <h2 className="vads-u-font-size--h3 vads-u-font-weight--normal vads-u-margin-top--0 vads-u-margin-bottom--2">
              Check the details of VA debt you might have related to your
              education, disability compensation, pension, or home loan
              benefits. Find out how to pay your debt and what to do if you need
              financial assistance.
            </h2>
            {allDebtsFetchFailure && renderAlert()}
            {allDebtsEmpty && renderEmptyAlert()}
            {!allDebtsFetchFailure &&
              !allDebtsEmpty && (
                <>
                  <AlertBox
                    className="vads-u-margin-bottom--2"
                    headline="VA debt collection is on hold due to the coronavirus"
                    content={bannerContent}
                    status="info"
                    isVisible
                  />
                  <DebtCardsList />
                  <DebtLettersList />
                </>
              )}
          </div>
          <div className="vads-u-display--flex vads-u-flex-direction--column vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4">
            <HowDoIPay />
            <NeedHelp />
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  isVBMSError: state.debtLetters.isVBMSError,
  isError: state.debtLetters.isError,
  debtLinks: state.debtLetters.debtLinks,
  debts: state.debtLetters.debts,
});

DebtLettersSummaryV1.propTypes = {
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

DebtLettersSummaryV1.defaultProps = {
  isVBMSError: false,
  isError: false,
  debtLinks: [],
  debts: [],
};

export default connect(mapStateToProps)(DebtLettersSummaryV1);
