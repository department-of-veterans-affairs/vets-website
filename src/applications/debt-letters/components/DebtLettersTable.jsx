import React, { useState } from 'react';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import orderBy from 'lodash/orderBy';
import recordEvent from 'platform/monitoring/record-event';

export const DebtLettersTable = ({ debtLinks }) => {
  const [sortBy, setSortBy] = useState('date');
  const [direction, setDirection] = useState('desc');

  const sortedDebtLinks = orderBy(debtLinks, [sortBy], direction);

  const handleDownloadClick = (type, date) => {
    return recordEvent({
      event: 'bam-debt-letter-download',
      'letter-type': type,
      'letter-received-date': date,
    });
  };

  const toggleDirection = column => {
    if (column !== sortBy) {
      setSortBy(column);
    }
    if (direction === 'desc') {
      return setDirection('asc');
    }
    return setDirection('desc');
  };

  return (
    <table
      className="vads-u-display--none vads-u-font-family--sans vads-u-margin-top--3 vads-u-margin-bottom--0 medium-screen:vads-u-display--block"
      role="table"
    >
      <thead>
        <tr role="row">
          <th
            className="vads-u-border--0 vads-u-padding-left--3"
            onClick={() => toggleDirection('date')}
            tabIndex="-1"
            scope="row"
          >
            Date <i className="fas fa-sort vads-u-margin-left--0p5" />
          </th>
          <th
            className="vads-u-border--0"
            onClick={() => toggleDirection('typeDescription')}
            tabIndex="-1"
            scope="row"
          >
            Type <i className="fas fa-sort vads-u-margin-left--0p5" />
          </th>
          <th className="vads-u-border--0" scope="row">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedDebtLinks.map(debtLetter => (
          <tr
            key={debtLetter.documentId}
            className="vads-u-border-top--1px vads-u-border-bottom--1px"
            role="row"
          >
            <td className="vads-u-border--0 vads-u-padding-left--3">
              {moment(debtLetter.receivedAt).format('MMM D, YYYY')}
            </td>
            <td className="vads-u-border--0">{debtLetter.typeDescription}</td>

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
                  Download {debtLetter.typeDescription} dated{' '}
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
  );
};
