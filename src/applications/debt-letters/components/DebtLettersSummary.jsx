import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import HowDoIPay from './HowDoIPay';
import NeedHelp from './NeedHelp';
import DebtCardsList from './DebtCardsList';
import DebtLettersList from './DebtLettersList';

const DebtLettersSummary = ({ isError, isVBMSError }) => {
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
  const allDebtsFetchFailure = isVBMSError && isError;
  return (
    <>
      <Breadcrumbs className="vads-u-font-family--sans">
        <a href="/">Home</a>
        <a href="/debt-letters">Manage your VA debt</a>
        <a href="/debt-letters/debt-list">Your VA debt</a>
      </Breadcrumbs>
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <h1 className="vads-u-padding-x--2p5 vads-u-margin-bottom--2">
          Your VA debt
        </h1>
        <div className="vads-u-display--flex vads-u-flex-direction--row">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <h2 className="vads-u-font-size--h3 vads-u-font-weight--normal vads-u-margin-top--0 vads-u-margin-bottom--3">
              Download your debt letters, learn your payment options, or find
              out how to get help with your VA debts.
            </h2>
            {allDebtsFetchFailure && renderAlert()}
            {!allDebtsFetchFailure && (
              <>
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
});

DebtLettersSummary.propTypes = {
  isVBMSError: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
};

DebtLettersSummary.defaultProps = {
  isVBMSError: false,
  isError: false,
};

export default connect(mapStateToProps)(DebtLettersSummary);
