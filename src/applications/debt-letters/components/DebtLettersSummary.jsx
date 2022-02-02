import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';
import DebtCardsList from './DebtCardsList';
import OnThisPageLinks from './OnThisPageLinks';

const ErrorAlert = () => (
  <section
    className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
    role="alert"
  >
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        We’re sorry. Something went wrong on our end.
      </h3>
      <p className="vads-u-font-family--sans">
        You can’t view information about your current debts or download your
        debt letters because something went wrong on our end.
      </p>
      <h4>What you can do</h4>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        If you need help resolving debt, or you would like to get information
        about a debt that has been resolved, call the Debt Management Center at
        <Telephone className="vads-u-margin-left--0p5" contact="8008270648" />.
      </p>
    </div>
  </section>
);

const EmptyItemsAlert = () => (
  <section className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3">
    <h2 className="vads-u-font-family--serif vads-u-margin-top--0 vads-u-font-size--h4">
      Our records show that you don’t have any current debts
    </h2>

    <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
      If you believe that you have a debt with the VA, call the Debt Management
      Center at
      <Telephone className="vads-u-margin-left--0p5" contact="8008270648" />.
    </p>
    <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
      For medical copayment debts, visit
      <a className="vads-u-margin-x--0p5" href="/health-care/pay-copay-bill/">
        Pay your VA copay bill
      </a>
      to learn about your payment options.
    </p>
  </section>
);

const DebtLettersSummary = ({ isError, isVBMSError, debts, debtLinks }) => {
  useEffect(() => {
    scrollToTop();
  }, []);

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

      <section className="vads-l-row vads-u-margin-x--neg2p5">
        <h1 className="vads-u-padding-x--2p5 vads-u-margin-bottom--2">
          Current VA debt
        </h1>

        <div className="vads-u-display--block">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <p className="va-introtext vads-u-margin-top--0 vads-u-margin-bottom--2">
              Check the details of VA debt you might have related to your
              education, disability compensation, or pension benefits. Find out
              how to pay your debt and what to do if you need financial
              assistance.
            </p>

            {allDebtsFetchFailure && <ErrorAlert />}

            {allDebtsEmpty && <EmptyItemsAlert />}

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
      </section>
    </>
  );
};

const mapStateToProps = state => ({
  isVBMSError: state.debtLetters.isVBMSError,
  isError: state.debtLetters.isError,
  debtLinks: state.debtLetters.debtLinks,
  debts: state.debtLetters.debts,
});

DebtLettersSummary.propTypes = {
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
  isError: PropTypes.bool,
  isVBMSError: PropTypes.bool,
};

DebtLettersSummary.defaultProps = {
  isVBMSError: false,
  isError: false,
  debtLinks: [],
  debts: [],
};

export default connect(mapStateToProps)(DebtLettersSummary);
