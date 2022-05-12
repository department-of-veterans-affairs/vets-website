import React from 'react';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import PropTypes from 'prop-types';
import { ErrorAlert, DependentDebt, NoDebtLinks } from './Alerts';
import mockDebtLinks from '../utils/mockDebtLinks.json';

const DebtLettersTable = ({ debtLinks, hasDependentDebts, isError }) => {
  const hasDebtLinks = !!debtLinks.length;

  const handleDownload = (type, date) => {
    return recordEvent({
      event: 'bam-debt-letter-download',
      'letter-type': type,
      'letter-received-date': date,
    });
  };

  if (isError) return <ErrorAlert />;
  if (hasDependentDebts) return <DependentDebt />;
  if (!hasDebtLinks) return <NoDebtLinks />;

  return (
    <>
      <h3>Latest Debt Letters</h3>
      <ul>
        <li className="no-bullets">
          {mockDebtLinks.debtLinks.map(debt => {
            const recvDate = moment(debt.receivedAt, 'YYYY-MM-DD').format(
              'MMM D, YYYY',
            );

            return (
              <div key={debt.documentId}>
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
                    <time
                      dateTime={recvDate}
                      className="vads-u-margin-left--0p5"
                    >
                      {recvDate}
                    </time>
                  </span>
                  <dfn>
                    <abbr title="Portable Document Format">(PDF)</abbr>
                  </dfn>
                </a>
              </div>
            );
          })}
        </li>
      </ul>
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
