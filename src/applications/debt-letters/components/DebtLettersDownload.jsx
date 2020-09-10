import React from 'react';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

  const handleDownloadClick = (type, date) => {
    return recordEvent({
      event: 'bam-debt-letter-download',
      'letter-type': type,
      'letter-received-date': date,
    });
  };
  return (
    <div>
      <h1
        id="downloadDebtLetters"
        className="vads-u-margin-top--4 vads-u-margin-bottom--2"
      >
        Download debt letters{' '}
      </h1>
      <h2 className="vads-u-font-size--h3 vads-u-font-weight--normal vads-u-margin-top--0 vads-u-margin-bottom--2">
        Download your debt letters, learn your payment options, or find out how
        to get help with your VA debts.
      </h2>
      {isVBMSError && renderAlert()}
      {!isVBMSError &&
        debtLinks.length > 0 && (
          <>
            <table className="vads-u-font-family--sans vads-u-margin-top--3 vads-u-margin-bottom--0">
              <thead>
                <tr>
                  <th className="vads-u-border--0 vads-u-padding-left--3">
                    Date
                  </th>
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
                    <td className="vads-u-border--0 vads-u-padding-left--3">
                      {moment(debtLetter.receivedAt).format('MMM D, YYYY')}
                    </td>
                    <td className="vads-u-border--0">
                      {debtLetter.typeDescription}
                    </td>
                    <td className="vads-u-border--0">
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          handleDownloadClick(
                            debtLetter.typeDescription,
                            moment(debtLetter.receivedAt).format('MMM D, YYYY'),
                          )
                        }
                        download={`${debtLetter.typeDescription} dated ${moment(
                          debtLetter.receivedAt,
                        ).format('MMM D, YYYY')}`}
                        href={encodeURI(
                          `${environment.API_URL}/v0/debt_letters/${
                            debtLetter.documentId
                          }`,
                        )}
                      >
                        <i
                          aria-hidden="true"
                          role="img"
                          className="fas fa-download vads-u-padding-right--1"
                        />
                        <span aria-hidden="true">Download letter </span>
                        <span className="sr-only">
                          Download Second Demand Letter dated{' '}
                          {moment(debtLetter.receivedAt).format('MMM D, YYYY')}
                        </span>
                        <dfn>
                          <abbr title="Portable Document Format">(PDF)</abbr>
                        </dfn>
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
            <h3 className="vads-u-font-family--serif vads-u-margin-top--0">
              VA debt collection is on hold due to the coronavirus
            </h3>
            <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
              We’ve taken action to stop collection on newly established Veteran
              debt and make it easier for Veterans to request extended repayment
              plans and address other financial needs during this time.
            </p>
            <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
              You won’t receive any debt collection letters in the mail until
              after December 31, 2020. For the latest information about managing
              VA debt, visit our{' '}
              <a href="http://va.gov/coronavirus-veteran-frequently-asked-questions/">
                coronavirus FAQs
              </a>
              {'.'}
            </p>
          </div>
        )}
      <div className="vads-u-margin-bottom--6 vads-u-margin-top--3">
        <h3 className="vads-u-margin-y--0">
          What if I don't see the letter I'm looking for?
        </h3>
        <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
          If you’ve received a letter about a VA debt, but don’t see the letter
          listed here call the VA Debt Management Center at{' '}
          <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
            800-827-0648
          </a>
          {'. '}
          You can also call the DMC to get information about your resolved debts
          For VA health care copay debt, please go to our{' '}
          <a href="/health-care/pay-copay-bill/">pay your VA copay bill</a> page
          to learn about your payment options.
        </p>
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
