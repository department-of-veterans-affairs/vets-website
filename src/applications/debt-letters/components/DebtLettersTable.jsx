import React from 'react';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import PropTypes from 'prop-types';
import { ErrorAlert, DependentDebt, NoDebtLinks } from './Alerts';
import mockDebtLinks from '../utils/mockDebtLinks.json';

const DebtLettersTable = ({ debtLinks, hasDependentDebts, isError }) => {
  const hasDebtLinks = !!debtLinks.length;

  let showOlder = false;
  const handleDownload = (type, date) => {
    return recordEvent({
      event: 'bam-debt-letter-download',
      'letter-type': type,
      'letter-received-date': date,
    });
  };

  const toggleShowOlderLetters = () => {
    showOlder = !showOlder;
  };

  const formatDate = date => {
    return moment(date, 'YYYY-MM-DD').format('MMM D, YYYY');
  };

  const hasMoreDebts = mockDebtLinks.debtLinks.length > 1;

  if (isError) return <ErrorAlert />;
  if (hasDependentDebts) return <DependentDebt />;
  if (!hasDebtLinks) return <NoDebtLinks />;

  return (
    <>
      <h3>Latest debt letters</h3>
      <ul className="no-bullets">
        {mockDebtLinks.debtLinks.map(debt => {
          const recvDate = moment(debt.receivedAt, 'YYYY-MM-DD').format(
            'MMM D, YYYY',
          );

          return (
            <li key={debt.documentId}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleDownload(debt.typeDescription, recvDate)}
                download={`${debt.typeDescription} dated ${recvDate}`}
                href={encodeURI(
                  `${environment.API_URL}/v0/debt_letters/${debt.documentId}`,
                )}
              >
                <i
                  aria-hidden="true"
                  role="img"
                  className="fas fa-download vads-u-padding-right--1"
                />
                <span aria-hidden="true">
                  {`${recvDate} - ${debt.typeDescription}`}{' '}
                </span>
                <span className="sr-only">
                  Download {debt.typeDescription} dated
                  <time dateTime={recvDate} className="vads-u-margin-left--0p5">
                    {recvDate}
                  </time>
                </span>
                <dfn>
                  <abbr title="Portable Document Format">(PDF)</abbr>
                </dfn>
              </a>
            </li>
          );
        })}
      </ul>

      {hasMoreDebts ? (
        <>
          <h5 className="vads-u-margin-top--2p5">
            {`Older letters (${mockDebtLinks.debtLinks.length - 2})`}
          </h5>
          <button
            type="button"
            className="debt-older-letters usa-button-secondary"
            aria-controls="older-letters-button"
            aria-expanded={showOlder}
            onClick={toggleShowOlderLetters}
          >
            {`${showOlder ? 'Hide' : 'Show'} older letters`}
          </button>
        </>
      ) : null}

      {showOlder && hasMoreDebts ? (
        <ol id="older-letters-list" className="no-bullets">
          {mockDebtLinks.debtLinks.slice(2).map((debt, index) => (
            <li key={index}>
              <div>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    handleDownload(debt.typeDescription, formatDate(debt.date))
                  }
                  download={`${debt.typeDescription} dated ${formatDate(
                    debt.date,
                  )}`}
                  href={encodeURI(
                    `${environment.API_URL}/v0/debt_letters/${debt.documentId}`,
                  )}
                >
                  <i
                    aria-hidden="true"
                    role="img"
                    className="fas fa-download vads-u-padding-right--1"
                  />
                  <span aria-hidden="true">
                    {`${formatDate(debt.date)} - ${debt.typeDescription}`}{' '}
                  </span>
                  <span className="sr-only">
                    Download {debt.typeDescription} dated
                    <time
                      dateTime={formatDate(debt.date)}
                      className="vads-u-margin-left--0p5"
                    >
                      {formatDate(debt.date)}
                    </time>
                  </span>
                  <dfn>
                    <abbr title="Portable Document Format">(PDF)</abbr>
                  </dfn>
                </a>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </>
  );
};

DebtLettersTable.propTypes = {
  debtLinks: PropTypes.arrayOf(
    PropTypes.shape({
      documentId: PropTypes.string,
      receivedAt: PropTypes.string,
      typeDescription: PropTypes.string,
    }),
  ),
  hasDependentDebts: PropTypes.bool,
  isError: PropTypes.bool,
};

export default DebtLettersTable;
