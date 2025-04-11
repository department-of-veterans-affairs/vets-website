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
import { parse, format } from 'date-fns';
import Modals from '../../medical-copays/components/Modals';
import { currency, setPageFocus, handlePdfGeneration } from '../utils/helpers';
import useHeaderPageTitle from '../hooks/useHeaderPageTitle';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';

// Helper function to clean HTML entities
const cleanHtmlEntities = text => {
  if (!text) return '';
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

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

  const debts = debtLetters.debts || [];
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

  // Get additional debt-specific information from the first debt if available
  const fileNumber = debts.length > 0 ? debts[0]?.fileNumber || '' : '';
  const payeeNumber = debts.length > 0 ? debts[0]?.payeeNumber || '' : '';
  const personEntitled = debts.length > 0 ? debts[0]?.personEntitled || '' : '';

  // Today's date formatted
  const todaysDate = format(new Date(), 'MMMM d, yyyy');

  // Data for One VA Debt Letter PDF
  const veteranContactInformation = {
    veteranFullName: userFullName,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    zipCode,
    stateCode,
    fileNumber,
    payeeNumber,
    personEntitled,
  };

  // Get the veteran's formatted name
  const getFormattedName = () => {
    if (userFullName.first && userFullName.last) {
      return `${userFullName.first} ${
        userFullName.middle ? `${userFullName.middle} ` : ''
      }${userFullName.last}${
        userFullName.suffix ? `, ${userFullName.suffix}` : ''
      }`;
    }
    return 'Veteran';
  };

  // Get formatted city, state, and zip
  const getFormattedCityStateZip = () => {
    return city && stateCode ? `${city}, ${stateCode} ${zipCode}` : '';
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

  const getMostRecentPaymentDate = () => {
    const defaultDate = new Date();
    defaultDate.setDate(1); // First day of the current month

    const allDates = debts
      .flatMap(debt => [
        ...(debt.debtHistory?.map(item => {
          if (item.date) {
            const parsedDate = parse(item.date, 'MM/dd/yyyy', new Date());
            return !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;
          }
          return null;
        }) || []),
        // Excluding fiscalTransactionData dates as they're in 2024 but data is from 2020
        debt.debtDate ? new Date(debt.debtDate) : null,
      ])
      .filter(date => date && !Number.isNaN(date.getTime()));

    return allDates.length > 0
      ? new Date(Math.max(...allDates.map(date => date.getTime())))
      : defaultDate;
  };

  // Get the most recent payment date and format it for display
  const statementDate = format(getMostRecentPaymentDate(), 'MMMM d, yyyy');

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
              {getFormattedName()}
              <br />
              {veteranContactInformation.addressLine1}
              {veteranContactInformation.addressLine2 ? (
                <>
                  <br />
                  {veteranContactInformation.addressLine2}
                </>
              ) : null}
              {veteranContactInformation.addressLine3 ? (
                <>
                  <br />
                  {veteranContactInformation.addressLine3}
                </>
              ) : null}
              <br />
              {getFormattedCityStateZip()}
            </p>
            <p className="vads-u-margin-top--2  vads-u-margin-bottom--2">
              File number: {veteranContactInformation.fileNumber}
              <br />
              Today’s date: {todaysDate}
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

        <section className="vads-u-margin-y--4 vads-u-padding-y--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-width--full">
          <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Copay charges
          </h2>
          <p className="vads-u-margin-top--0">
            You are receiving this billing statement because you are currently
            enrolled in a priority group requiring copayments for treatment of
            non-service connected conditions.
          </p>
          <p className="vads-u-margin-bottom--2">
            Statements do not reflect payments received by {statementDate}.
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
                  <span>{cleanHtmlEntities(charge.pDTransDescOutput)}</span>
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

        <section className="vads-u-margin-y--2 vads-u-padding-y--2 vads-u-border-color--gray-light vads-u-width--full">
          <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Overpayment charges
          </h2>
          <p className="vads-u-margin-top--0">
            Benefit overpayments are due to changes in your benefits which
            result in you being paid more than you were owed.
          </p>
          <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--1">
            Resolve your overpayment
          </h3>
          <p className="vads-u-margin-top--0">
            You can pay your debt online, by phone, or by mail. Call us at{' '}
            <va-telephone contact="8008270648" /> to discuss payment options,
            request financial help, or dispute your bill
          </p>
          <va-link-action
            href="/manage-va-debt/summary"
            text="Review and resolve overpayments"
            type="secondary"
          />

          <p className="vads-u-margin-bottom--3">
            Payments made after {statementDate} will not be reflected here.
          </p>

          {/* Combined Overpayment Charges Table */}
          <div className="vads-u-width--full">
            <va-table
              table-type="bordered"
              table-title="Overpayment charges"
              className="vads-u-width--full vads-u-margin-x--0"
              style={{ width: '100%', maxWidth: '100%', display: 'block' }}
            >
              <va-table-row slot="headers">
                <span>Date</span>
                <span>Description</span>
                <span>Amount</span>
              </va-table-row>

              {/* Map all debts into single table rows */}
              {debts.map((debt, index) => {
                const formattedDate =
                  debt.debtHistory && debt.debtHistory.length > 0
                    ? format(
                        parse(
                          debt.debtHistory[0].date,
                          'MM/dd/yyyy',
                          new Date(),
                        ),
                        'MMMM d, yyyy',
                      )
                    : '';

                const debtAmount = parseFloat(
                  debt.currentAr || debt.originalAr || 0,
                );

                return (
                  <va-table-row key={`debt-combined-${index}`}>
                    <span>{formattedDate}</span>
                    <span>
                      <strong>
                        {deductionCodes[debt.deductionCode] ||
                          debt.benefitType ||
                          'VA Debt'}
                      </strong>
                    </span>
                    <span>{currency(debtAmount)}</span>
                  </va-table-row>
                );
              })}

              {/* Grand Total row */}
              <va-table-row>
                <span />
                <span className="vads-u-text-align--right vads-u-font-weight--bold">
                  Total Due:
                </span>
                <span className="vads-u-font-weight--bold">
                  {currency(
                    debts.reduce(
                      (total, debt) =>
                        total +
                        parseFloat(debt.currentAr || debt.originalAr || 0),
                      0,
                    ),
                  )}
                </span>
              </va-table-row>
            </va-table>
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
