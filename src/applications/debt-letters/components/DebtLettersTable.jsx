import React from 'react';
import Table from '@department-of-veterans-affairs/component-library/Table';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { ErrorAlert, DependentDebt, NoDebtLinks } from './Alerts';

const DebtLettersTable = ({ debtLinks, hasDependentDebts, isError }) => {
  const hasDebtLinks = !!debtLinks.length;

  const handleDownload = (type, date) => {
    return recordEvent({
      event: 'bam-debt-letter-download',
      'letter-type': type,
      'letter-received-date': date,
    });
  };

  const tableData = debtLinks.map(debt => {
    const recvDate = moment(debt.receivedAt, 'YYYY-MM-DD').format(
      'MMM D, YYYY',
    );

    return {
      date: moment(debt.date, 'YYYY-MM-DD').format('MMM D, YYYY'),
      type: debt.typeDescription,
      action: (
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
          <span aria-hidden="true">Download letter </span>
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
      ),
    };
  });

  const tableSort = {
    order: 'DESC',
    value: 'date',
  };

  const tableFields = [
    {
      label: 'Date',
      value: 'date',
      sortable: true,
    },
    {
      label: 'Type',
      value: 'type',
    },
    {
      label: 'Action',
      value: 'action',
    },
  ];

  if (isError) return <ErrorAlert />;
  if (hasDependentDebts) return <DependentDebt />;
  if (!hasDebtLinks) return <NoDebtLinks />;

  return (
    <Table data={tableData} currentSort={tableSort} fields={tableFields} />
  );
};

export default DebtLettersTable;
