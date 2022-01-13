import React from 'react';
import Table from '@department-of-veterans-affairs/component-library/Table';
import moment from 'moment';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const ErrorAlert = () => (
  <div
    className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
    role="alert"
  >
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        Your debt letters are currently unavailable.
      </h3>
      <p className="vads-u-font-family--sans">
        You can’t download your debt letters because something went wrong on our
        end.
      </p>
      <h4>What you can do</h4>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        You can check back later or call the Debt Management Center at
        <Telephone className="vads-u-margin-x--0p5" contact="8008270648" /> to
        find out more information about how to resolve your debt.
      </p>
    </div>
  </div>
);

const DependentDebt = () => (
  <div
    className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
    role="alert"
  >
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">
        Your debt letters are currently unavailable.
      </h3>
      <p className="vads-u-font-family--sans">
        You can’t download your debt letters because something went wrong on our
        end.
      </p>
      <h4>What you can do</h4>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        If you need to access debt letters that were mailed to you, call the
        Debt Management Center at <Telephone contact="8008270648" />.
      </p>
    </div>
  </div>
);

const NoDebtLinks = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-bottom--2">
    <div className="usa-alert-body">
      <h3 className="usa-alert-heading">You don’t have any VA debt letters</h3>
      <p className="vads-u-font-family--sans">
        Our records show you don’t have any debt letters related to VA benefits.
        If you think this is an error, please contact the Debt Management Center
        at <Telephone contact="8008270648" />.
      </p>
      <p className="vads-u-font-family--sans vads-u-margin-y--0">
        If you have VA health care copay debt, go to our
        <a className="vads-u-margin-x--0p5" href="/health-care/pay-copay-bill/">
          Pay your VA copay bill
        </a>
        page to learn about your payment options.
      </p>
    </div>
  </div>
);

const DebtLettersTable = ({
  debtLinks,
  isError,
  isVBMSError,
  hasDependentDebts,
}) => {
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

  if (isError || isVBMSError) return <ErrorAlert />;
  if (hasDependentDebts) return <DependentDebt />;
  if (!hasDebtLinks) return <NoDebtLinks />;

  return (
    <Table data={tableData} currentSort={tableSort} fields={tableFields} />
  );
};

export default DebtLettersTable;
