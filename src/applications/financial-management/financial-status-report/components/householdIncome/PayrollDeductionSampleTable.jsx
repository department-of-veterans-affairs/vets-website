import React from 'react';

const DeductionSampleTable = () => {
  return (
    <>
      <p className="sr-only">
        A sample two-column table from a pay stub showing common deductions and
        their amounts, including Federal Tax, State Tax, Health Insurance, FICA,
        and Retirement Accounts.
      </p>
      <div aria-hidden="true">
        <va-table class="usa-table usa-table--borderless">
          <va-table-row slot="headers">
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border--0 vads-u-border-bottom--1px vads-u-background-color--white vads-u-border-color--gray-medium vads-u-padding-x--0">
              Deduction
            </span>
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border--0 vads-u-border-bottom--1px vads-u-background-color--white vads-u-border-color--gray-medium vads-u-padding-right--0 vads-u-text-align--right">
              Amount
            </span>
          </va-table-row>
          <va-table-row>
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border-color--gray-light vads-u-padding-x--0">
              Federal tax
            </span>
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border-color--gray-light vads-u-padding-x--0 medium-screen:vads-u-text-align--right">
              $128.92
            </span>
          </va-table-row>
          <va-table-row>
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border-color--gray-light vads-u-padding-x--0">
              State tax
            </span>
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border-color--gray-light vads-u-padding-x--0 medium-screen:vads-u-text-align--right">
              $28.94
            </span>
          </va-table-row>
          <va-table-row>
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border-color--gray-light vads-u-padding-x--0">
              Health Insurance
            </span>
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border-color--gray-light vads-u-padding-x--0 medium-screen:vads-u-text-align--right">
              $28.25
            </span>
          </va-table-row>
          <va-table-row>
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border-color--gray-light vads-u-padding-x--0">
              FICA
            </span>
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border-color--gray-light vads-u-padding-x--0 medium-screen:vads-u-text-align--right">
              $68.36
            </span>
          </va-table-row>
          <va-table-row>
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border-color--gray-light vads-u-padding-x--0">
              Retirement acccount
            </span>
            <span className="vads-u-padding-y--0 medium-screen:vads-u-padding-y--1 vads-u-margin-y--0p5 medium-screen:vads-u-margin-y--0 vads-u-border-color--gray-light vads-u-padding-x--0 medium-screen:vads-u-text-align--right">
              $82.45
            </span>
          </va-table-row>
        </va-table>
      </div>
    </>
  );
};

export default DeductionSampleTable;
