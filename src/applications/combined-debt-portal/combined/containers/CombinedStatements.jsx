import React, { useEffect } from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';

import Modals from '../../medical-copays/components/Modals';
import { setPageFocus } from '../utils/helpers';
import useHeaderPageTitle from '../hooks/useHeaderPageTitle';

const CombinedStatements = () => {
  useHeaderPageTitle('Combined statement');

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  const formatCurrency = amount => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Mock data to match the mockup
  const recipientInfo = {
    name: 'Travis Jones',
    address: '1234 Main St',
    cityStateZip: 'Tampa, FL 33612-4745',
    fileNumber: '111002222',
    statementDate: 'September 30, 2024',
  };

  // Mock copay charges data
  const copayCharges = [
    {
      description:
        'COPAY RX# 5460327 FILL DATE 03/08/2024\nDRUG: SERTRALINE HCL 100MG TAB (DAYS:30\nQTY:30)\nDRUG CLASS: SERTRALINE HCL CHG=$5.00',
      reference: 'K78-K9GJR25',
      amount: 5,
    },
    {
      description: 'OUTPATIENT CARE DATE: 03/08/2024',
      reference: 'K78-K9GJR25',
      amount: 20,
    },
    {
      description: 'OUTPATIENT CARE DATE: 03/10/2024',
      reference: 'K78-K9GJR25',
      amount: 20,
    },
  ];

  // Mock overpayment charges data
  const overpaymentCharges = [
    {
      date: 'July 25, 2024',
      description:
        'Disability compensation and pension debt\nFirst posted date',
      amount: 250,
    },
    {
      date: 'May 5, 2024',
      description:
        'Partial payment of $100.00 for Post-9/11 GI Bill debt for housing\nReceived via ACH',
      amount: 100,
    },
    {
      date: 'April 15, 2024',
      description: 'Post-9/11 GI Bill debt for housing\nFirst posted date',
      amount: 500,
    },
  ];

  return (
    <>
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'VA.gov Home',
          },
          {
            href: '/manage-va-debt/summary',
            label: 'Your VA debt and bills',
          },
          {
            href: '#',
            label: 'Combined statement',
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="detail-page-title" className="vads-u-margin-bottom--2">
          Combined statement
        </h1>

        <div className="vads-u-margin-y--3">
          <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-font-size--h2">
            Veteran information
          </h2>
          <div className="vads-u-margin-bottom--2">
            <strong className="vads-u-font-size--h4 vads-u-margin-top--2 vads-u-margin-bottom--1">
              Recipient address
            </strong>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              {recipientInfo.name}
              <br />
              {recipientInfo.address}
              <br />
              {recipientInfo.cityStateZip}
            </p>
            <p className="vads-u-margin-top--2  vads-u-margin-bottom--2">
              File number: {recipientInfo.fileNumber}
              <br />
              Today’s date: {recipientInfo.statementDate}
            </p>
            <va-button text="Download combined statement" />
          </div>
        </div>

        <section className="vads-u-margin-y--4 vads-u-padding-y--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
          <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Copay charges
          </h2>
          <p className="vads-u-margin-top--0">
            You are receiving this billing statement because you are currently
            enrolled in a priority group requiring copayments for treatment of
            non-service connected conditions.
          </p>
          <p className="vads-u-margin-bottom--2">
            Statements do not reflect payments received by September 1, 2024.
          </p>

          <va-table
            table-type="bordered"
            table-title="CLEVELAND VAMC - Cleveland"
            className="vads-u-width--full"
          >
            <va-table-row slot="headers">
              <span>Description</span>
              <span>Billing reference</span>
              <span>Amount</span>
            </va-table-row>

            {copayCharges.map((charge, idx) => (
              <va-table-row key={idx}>
                <span>
                  {charge.description.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < charge.description.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
                <span>{charge.reference}</span>
                <span>{formatCurrency(charge.amount)}</span>
              </va-table-row>
            ))}

            <va-table-row>
              <span />
              <span className="vads-u-text-align--right vads-u-font-weight--bold">
                Total Due:
              </span>
              <span className="vads-u-font-weight--bold">
                {formatCurrency(
                  copayCharges.reduce(
                    (total, charge) => total + charge.amount,
                    0,
                  ),
                )}
              </span>
            </va-table-row>
          </va-table>

          <va-table
            table-type="bordered"
            table-title="James A. Haley Veterans' Hospital"
            className="vads-u-margin-top--4 vads-u-width--full"
          >
            <va-table-row slot="headers">
              <span>Description</span>
              <span>Billing reference</span>
              <span>Amount</span>
            </va-table-row>

            <va-table-row>
              <span>OUTPATIENT CARE DATE: 09/20/2024</span>
              <span>K78-K9GJR25</span>
              <span>{formatCurrency(20)}</span>
            </va-table-row>

            <va-table-row>
              <span />
              <span className="vads-u-text-align--right vads-u-font-weight--bold">
                Total Due:
              </span>
              <span className="vads-u-font-weight--bold">
                {formatCurrency(20)}
              </span>
            </va-table-row>
          </va-table>

          <div className="vads-u-margin-top--3">
            <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--1">
              Resolve your copay bills
            </h3>
            <p className="vads-u-margin-top--0">
              You can pay your debt online, by phone, or by mail. Call us at{' '}
              <va-telephone contact="8664001238" /> to discuss payment options,
              request financial help, or dispute your bill.
            </p>
            <va-link-action
              href="/manage-va-debt/summary"
              text=" Manage your VA debt"
              type="secondary"
            />
          </div>
        </section>

        <section className="vads-u-margin-y--4 vads-u-padding-y--2 vads-u-border-color--gray-light">
          <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Overpayment charges
          </h2>
          <p className="vads-u-margin-top--0">
            Benefit overpayments are due to changes in your benefits which
            result in you being paid more than you were entitled to receive.
          </p>
          <p className="vads-u-margin-bottom--3">
            Statement does not reflect payments received by September 1, 2024.
          </p>

          <va-table
            table-type="bordered"
            table-title="Overpayment charges"
            className="vads-u-width--full"
          >
            <va-table-row slot="headers">
              <span>Date</span>
              <span>Description</span>
              <span>Amount</span>
            </va-table-row>

            {overpaymentCharges.map((charge, idx) => (
              <va-table-row key={idx}>
                <span>{charge.date}</span>
                <span>
                  {charge.description.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < charge.description.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
                <span>{formatCurrency(charge.amount)}</span>
              </va-table-row>
            ))}

            <va-table-row>
              <span />
              <span className="vads-u-text-align--right vads-u-font-weight--bold">
                Total Due:
              </span>
              <span className="vads-u-font-weight--bold">
                {formatCurrency(
                  overpaymentCharges.reduce(
                    (total, charge) => total + charge.amount,
                    0,
                  ),
                )}
              </span>
            </va-table-row>
          </va-table>

          <div className="vads-u-margin-top--3">
            <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--1">
              Resolve your overpayment debt
            </h3>
            <p className="vads-u-margin-top--0">
              You can pay your debt online, by phone, or by mail. Call us at{' '}
              <va-telephone contact="8008270648" /> to discuss payment options,
              request financial help, or dispute your bill.
            </p>
            <va-link-action
              href="/manage-va-debt/summary"
              text=" Manage your VA debt"
              type="secondary"
            />
          </div>
        </section>

        <Modals title="Notice of rights and responsibilities" id="notice-modal">
          <Modals.Rights />
        </Modals>
      </div>
    </>
  );
};

export default CombinedStatements;
