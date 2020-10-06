import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import { DebtLettersTable } from './DebtLettersTable';
import { MobileTableView } from './MobileTableView';

const DebtLettersDownload = ({ debtLinks, isVBMSError }) => {
  const renderAlert = () => (
    <div
      className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
      role="alert"
    >
      <div className="usa-alert-body">
        <h3 className="usa-alert-heading">
          Your debt letters are currently unavailable.
        </h3>
        <p className="vads-u-font-family--sans">
          You can't download your debt letters because something went wrong on
          our end.
        </p>
        <p className="vads-u-margin-bottom--1">
          <strong>What you can do</strong>
        </p>
        <p className="vads-u-font-family--sans vads-u-margin-y--0">
          You can check back later or call the Debt Management Center at{' '}
          <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
            800-827-0648
          </a>{' '}
          to find out more information about how to resolve your debt.
        </p>
      </div>
    </div>
  );

  return (
    <div classNam="vads-l-row vads-u-margin-x--neg2p5">
      <Breadcrumbs className="vads-u-font-family--sans">
        <a href="/">Home</a>
        <a href="/manage-va-debt">Manage your VA debt</a>
        <a href="/manage-va-debt/your-debt">Current VA debt</a>
        <a href="/manage-va-debt/your-debt/debt-letters">
          Download debt letters
        </a>
      </Breadcrumbs>
      <div className="large-screen:vads-l-col--8">
        <h1 id="downloadDebtLetters" className="vads-u-margin-bottom--2">
          Download debt letters{' '}
        </h1>
        <p className="vads-u-font-weight--normal vads-u-color--gray-dark vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-font-size--lg">
          Download your debt letters, learn your payment options, or find out
          how to get help with your VA debts.
        </p>
        {isVBMSError && renderAlert()}
        {!isVBMSError &&
          debtLinks.length > 0 && (
            <>
              <h3 className="vads-u-margin-bottom--0">Your debt letters</h3>
              <DebtLettersTable debtLinks={debtLinks} />
              <MobileTableView debtLinks={debtLinks} />
            </>
          )}
        {!isVBMSError &&
          debtLinks.length < 1 && (
            <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3">
              <h2 className="vads-u-font-family--serif vads-u-margin-top--0 vads-u-font-size--h3">
                VA debt collection is on hold due to the coronavirus
              </h2>
              <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
                We’ve taken action to stop collection on newly established
                Veteran debt and make it easier for Veterans to request extended
                repayment plans and address other financial needs during this
                time.
              </p>
              <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
                You won’t receive any debt collection letters in the mail until
                after December 31, 2020. For the latest information about
                managing VA debt, visit our{' '}
                <a href="http://va.gov/coronavirus-veteran-frequently-asked-questions/">
                  coronavirus FAQs
                </a>
                {'.'}
              </p>
            </div>
          )}
        <div className="vads-u-margin-bottom--6 vads-u-margin-top--5">
          <h3 className="vads-u-margin-y--0">
            What if I don't see the letter I'm looking for?
          </h3>
          <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
            If you’ve received a letter about a VA debt, but don’t see the
            letter listed here call the Debt Management Center at{' '}
            <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
              800-827-0648
            </a>
            {'. '}
            You can also call the Debt Management Center to get information
            about your resolved debts.
          </p>
          <p className="vads-u-font-family--sans">
            For medical copay debt, please go to{' '}
            <a href="/health-care/pay-copay-bill/">pay your VA copay bill</a> to
            learn about your payment options.
          </p>
          <p>
            <Link
              className="vads-u-font-family--sans vads-u-font-size--sm"
              to="/"
            >
              <i className="fa fa-chevron-left" /> Return to your list of debts.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isVBMSError: state.debtLetters.isVBMSError,
  debtLinks: state.debtLetters.debtLinks,
});

DebtLettersDownload.propTypes = {
  isVBMSError: PropTypes.bool.isRequired,
  debtLinks: PropTypes.arrayOf(
    PropTypes.shape({
      documentId: PropTypes.string,
      receivedAt: PropTypes.string,
      typeDescription: PropTypes.string,
    }),
  ),
};

DebtLettersDownload.defaultProps = {
  isVBMSError: false,
  debtLinks: [],
};

export default connect(mapStateToProps)(DebtLettersDownload);
