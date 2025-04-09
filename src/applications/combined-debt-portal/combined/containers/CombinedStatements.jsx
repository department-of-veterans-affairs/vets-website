import React, { useEffect, useMemo } from 'react';
import {
  VaBreadcrumbs,
  VaButton,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/web-components/react-bindings';
import { useSelector } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import {
  selectProfile,
  selectVAPMailingAddress,
} from '~/platform/user/selectors';
import environment from 'platform/utilities/environment';
import Modals from '../../medical-copays/components/Modals';
import { currency, setPageFocus, handlePdfGeneration } from '../utils/helpers';
import useHeaderPageTitle from '../hooks/useHeaderPageTitle';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';

const CombinedStatements = () => {
  useHeaderPageTitle('Combined statements');
  useEffect(() => {
    setPageFocus('h1');
  }, []);
  const {
    useToggleLoadingValue,
    useToggleValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();
  
  // boolean value to represent if toggles are still loading or not
  const togglesLoading = useToggleLoadingValue();
  const showOneVADebtLetterDownload = useToggleValue(
    TOGGLE_NAMES.showOneVADebtLetter,
  );

  const { debtLetters, mcp } = useSelector(
    ({ combinedPortal }) => combinedPortal,
  );

  // Get errors
  const billError = mcp.error;
  const debtError = debtLetters.errors?.length > 0;

  const { debts } = debtLetters;
  const bills = mcp.statements;

  // Pulling veteran contact information from the Redux store
  const {
    addressLine1 = '',
    addressLine2 = '',
    addressLine3 = '',
    city = '',
    zipCode = '',
    stateCode = '',
  } = useSelector(selectVAPMailingAddress);
  const { userFullName = {} } = useSelector(selectProfile);

  // Data for One VA Debt Letter PDF
  const veteranContactInformation = {
    veteranFullName: userFullName,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    zipCode,
    stateCode,
    fileNumber: debts[0]?.fileNumber || '',
  };

  // Merge into namespaced pdfData for One VA Debt Letter PDF
  const pdfData = {
    copays: bills,
    debts,
    veteranContactInformation,
  };

  const showOneVADebtLetterDownloadButton = useMemo(
    () => {
      // 403 error is not enrolled, so bills aren't proper borked
      const billsBorked = billError ? billError?.code !== '403' : false;
      return showOneVADebtLetterDownload && !debtError && !billsBorked;
    },
    [billError, debtError, showOneVADebtLetterDownload],
  );
  
  // If the feature flag is not enabled, redirect to the summary page
  if (!showOneVADebtLetterDownload) {
    window.location.replace('/manage-va-debt/summary');
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
        />
      </div>
    );
  }

  // give features a chance to fully load before we conditionally render
  if (togglesLoading) {
    return <VaLoadingIndicator message="Loading features..." />;
  }

  // Get the most recent date from the debtLetters data
  const getMostRecentPaymentDate = () => {
    // Default to current month's 1st date if no data is available
    const defaultDate = new Date();
    defaultDate.setDate(1); // First day of current month

    if (!debtLetters?.debts?.length) {
      return defaultDate;
    }

    // Collect all dates from debt histories
    const allDates = [];

    debtLetters.debts.forEach(debt => {
      if (debt.debtHistory?.length) {
        debt.debtHistory.forEach(item => {
          if (item.date) {
            // Parse the date (assuming format MM/DD/YYYY)
            const parts = item.date.split('/');
            if (parts.length === 3) {
              const date = new Date(
                parseInt(parts[2], 10),
                parseInt(parts[0], 10) - 1,
                parseInt(parts[1], 10),
              );
              allDates.push(date);
            }
          }
        });
      }

      // Also consider debt date if available
      if (debt.debtDate) {
        const date = new Date(debt.debtDate);
        if (!isNaN(date.getTime())) {
          allDates.push(date);
        }
      }
    });

    // Return the most recent date or default
    return allDates.length > 0
      ? new Date(Math.max.apply(null, allDates.map(date => date.getTime())))
      : defaultDate;
  };

  // Format the date as "Month DD, YYYY"
  const formatStatementDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get the most recent payment date for the statement
  const statementDate = formatStatementDate(getMostRecentPaymentDate());

  // Mock data to match the mockup
  const recipientInfo = {
    name: 'Travis Jones',
    address: '1234 Main St',
    cityStateZip: 'Tampa, FL 33612-4745',
    fileNumber: '111002222',
    statementDate: 'September 30, 2024',
  };

  const copayTotalRow = copay => {
    return (
      <va-table-row>
        <span> </span>
        <span className="vads-u-text-align--right vads-u-font-weight--bold">
          Total Due:
        </span>
        <span className="vads-u-font-weight--bold">
          {currency(
            copay.details.reduce(
              (total, charge) =>
                total +
                parseFloat(charge.pDTransAmtOutput.replace(/[^0-9.-]+/g, '')),
              0,
            ),
          )}
        </span>
      </va-table-row>
    );
  };

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
            {showOneVADebtLetterDownloadButton ? (
              <VaButton
                onClick={() => handlePdfGeneration(environment, pdfData)}
                text="Download combined statement"
                className="vads-u-margin-bottom--2"
              />
            ) : null}
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

          {/* Copay charges tables */}
          {mcp.statements.map(statement => (
            <va-table
              key={statement.station.facilityName}
              table-type="bordered"
              table-title={statement.station.facilityName}
              className="vads-u-width--full"
            >
              <va-table-row slot="headers">
                <span>Description</span>
                <span>Billing reference</span>
                <span>Amount</span>
              </va-table-row>

              {statement.details.map((charge, idx) => (
                <va-table-row key={idx}>
                  <span>{charge.pDTransDescOutput}</span>
                  <span>{charge.pDRefNo}</span>
                  <span>{currency(charge.pDTransAmt)}</span>
                </va-table-row>
              ))}

              {copayTotalRow(statement)}
            </va-table>
          ))}

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
            Statement does not reflect payments received by {statementDate}.
          </p>

          {/* Debt Letters tables */}
          {debtLetters &&
            debtLetters.debts &&
            debtLetters.debts.map((debt, index) => (
              <va-table
                key={`debt-${index}`}
                table-type="bordered"
                table-title={`${deductionCodes[debt.deductionCode] ||
                  debt.benefitType ||
                  'VA Debt'}`}
                className="vads-u-width--full"
              >
                <va-table-row slot="headers">
                  <span>Date</span>
                  <span>Description</span>
                  <span>Amount</span>
                </va-table-row>

                {/* Debt History rows */}
                {debt.debtHistory &&
                  debt.debtHistory.map((historyItem, idx) => (
                    <va-table-row key={`history-${idx}`}>
                      <span>{historyItem.date}</span>
                      <span>
                        <p className="vads-u-margin--0 vads-u-font-size-md">
                          <strong>{historyItem.description}</strong>
                        </p>
                      </span>
                      <span>
                        {/* We assume the amount is in the debt object for history items */}
                        {idx === 0
                          ? formatCurrency(parseFloat(debt.originalAr || 0))
                          : '—'}
                      </span>
                    </va-table-row>
                  ))}

                {/* If there's no debt history, show the original debt details */}
                {(!debt.debtHistory || debt.debtHistory.length === 0) && (
                  <va-table-row>
                    <span>{formatDate(debt.debtDate || '')}</span>
                    <span>
                      <strong>
                        Overpayment for{' '}
                        {deductionCodes[debt.deductionCode] ||
                          debt.benefitType ||
                          'VA Benefit'}
                      </strong>
                    </span>
                    <span>
                      {formatCurrency(parseFloat(debt.originalAr || 0))}
                    </span>
                  </va-table-row>
                )}

                {/* Total row */}
                <va-table-row>
                  <span />
                  <span className="vads-u-text-align--right vads-u-font-weight--bold">
                    Total Due:
                  </span>
                  <span className="vads-u-font-weight--bold">
                    {formatCurrency(
                      parseFloat(debt.currentAr || debt.originalAr || 0),
                    )}
                  </span>
                </va-table-row>
              </va-table>
            ))}

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
