import React from 'react';
import environment from 'platform/utilities/environment';
import moment from 'moment';
import { connect } from 'react-redux';

const DebtLettersList = ({ debtLinks, isVBMSError }) => {
  const renderAlert = () => (
    <div
      className="usa-alert usa-alert-error vads-u-margin-top--0"
      role="alert"
    >
      <div className="usa-alert-body">
        <h3 className="usa-alert-heading">
          Your debt letters are currently unavailable
        </h3>
        <p className="vads-u-font-family--sans">
          You can't download your debt letters because something went wrong on
          our end.
        </p>
        <p>
          <strong>What you can do</strong>
        </p>
        <p className="vads-u-font-family--sans">
          You can check back later or call the Debt Management Center at{' '}
          <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
            800-827-0648
          </a>{' '}
          to find out more information about how to resolve your debt
        </p>
      </div>
    </div>
  );
  return (
    <div className="vads-l-row ">
      <p className="vads-u-font-size--h2 vads-u-font-weight--bold vads-u-margin-top--1p5 vads-u-margin-bottom--2">
        Your Debt Letters
      </p>
      {isVBMSError && renderAlert()}
      {!isVBMSError &&
        debtLinks.length > 0 && (
          <>
            <p className="vads-u-margin-y--0 vads-u-font-family--sans">
              You can view a list of letters sent to your address and download
              them.
            </p>
            <table className="vads-u-font-family--sans vads-u-margin-top--3 vads-u-margin-bottom--0">
              <thead>
                <tr>
                  <th className="vads-u-border--0">Date</th>
                  <th className="vads-u-border--0">Type</th>
                  <th className="vads-u-border--0">Action</th>
                </tr>
              </thead>
              <tbody>
                {debtLinks.map(debtLetter => (
                  <tr
                    key={debtLetter.documentId}
                    className="vads-u-border-top--1px vads-u-border-bottom--1px"
                  >
                    <td className="vads-u-border--0">
                      {moment(debtLetter.receivedAt).format('MMM D, YYYY')}
                    </td>
                    <td className="vads-u-border--0">
                      {debtLetter.typeDescription}
                    </td>
                    <td className="vads-u-border--0">
                      <a
                        href={encodeURI(
                          `${environment.API_URL}/v0/debt_letters/${
                            debtLetter.documentId
                          }`,
                        )}
                      >
                        Download Letter
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      {!isVBMSError &&
        debtLinks.length < 1 && (
          <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3">
            <h4 className="vads-u-font-family--serif vads-u-margin-top--0">
              Our records show that you don't have any debt letters
            </h4>
            <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
              If you believe that you have a debt with the VA, call the Debt
              Management Center at{' '}
              <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
                800-827-0648
              </a>
            </p>
            <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
              For medical copayment debts, visit{' '}
              <a href="/health-care/pay-copay-bill/">Pay your VA copay bill</a>{' '}
              to learn about your payment options.
            </p>
          </div>
        )}
      <div className="vads-u-margin-bottom--6 vads-u-margin-top--3">
        <h3 className="vads-u-margin-y--0 vads-u-font-size--h4">
          What if I don't see the letter I'm looking for?
        </h3>
        <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
          If you have been notified of a debt and don't see the debt's letter on
          this page, or you would like to get information about your debts that
          have been resolved, call the Debt Management Center at{' '}
          <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
            800-827-0648
          </a>
        </p>
        <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
          For medical copayment debts, visit{' '}
          <a href="/health-care/pay-copay-bill/">Pay your VA copay bill</a> to
          learn about your payment options.
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isVBMSError: state.debtLetters.isVBMSError,
  debtLinks: state.debtLetters.debtLinks,
});

export default connect(mapStateToProps)(DebtLettersList);
