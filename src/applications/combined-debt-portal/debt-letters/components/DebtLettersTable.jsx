import React, { useState } from 'react';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import PropTypes from 'prop-types';
import {
  DependentDebt,
  ErrorAlert,
  NoDebtLinks,
  DebtLetterDownloadDisabled,
} from './Alerts';

const DebtLettersTable = ({
  debtLinks,
  hasDependentDebts,
  isError,
  showDebtLetterDownload,
}) => {
  const hasDebtLinks = !!debtLinks.length;
  const [showOlder, toggleShowOlderLetters] = useState(false);

  const handleDownload = (type, date) => {
    return recordEvent({
      event: 'bam-debt-letter-download',
      'letter-type': type,
      'letter-received-date': date,
    });
  };

  const formatDate = date => {
    return moment(date, 'YYYY-MM-DD').format('MMM D, YYYY');
  };

  const hasMoreThanOneDebt = debtLinks.length > 1;

  const debtLinksDescending = debtLinks.sort(
    (d1, d2) => new Date(d2.date).getTime() - new Date(d1.date).getTime(),
  );

  const [first, second, ...rest] = debtLinksDescending;

  if (!showDebtLetterDownload) return <DebtLetterDownloadDisabled />;
  if (isError) return <ErrorAlert />;
  if (hasDependentDebts) return <DependentDebt />;
  if (!hasDebtLinks) return <NoDebtLinks />;

  return (
    <>
      <h3>Latest debt letters</h3>
      <ul
        className="no-bullets vads-u-padding-x--0"
        data-testId="debt-letters-table"
      >
        {[first, second].map(debt => {
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
                <va-icon
                  icon="file_download"
                  size={3}
                  className="vads-u-padding-right--1"
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

      {hasMoreThanOneDebt ? (
        <>
          <h5 className="vads-u-margin-top--2p5">
            {`Older letters (${debtLinks.length - 2})`}
          </h5>
          <button
            type="button"
            className="debt-older-letters usa-button-secondary"
            aria-expanded={showOlder}
            onClick={() => toggleShowOlderLetters(!showOlder)}
          >
            {`${showOlder ? 'Hide' : 'Show'} older letters`}
          </button>
        </>
      ) : null}

      {showOlder && hasMoreThanOneDebt ? (
        <ol id="older-letters-list" className="no-bullets vads-u-padding-x--0">
          {rest.map((debt, index) => (
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
                  <va-icon
                    icon="file_download"
                    size={3}
                    className="vads-u-padding-right--1"
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
  showDebtLetterDownload: PropTypes.bool,
};

export default DebtLettersTable;
