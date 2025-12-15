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
import last from 'lodash/last';
import { parse, format } from 'date-fns';
import Modals from '../components/Modals';
import {
  currency,
  setPageFocus,
  handlePdfGeneration,
  formatDate,
  APP_TYPES,
} from '../utils/helpers';
import useHeaderPageTitle from '../hooks/useHeaderPageTitle';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import ZeroBalanceCard from '../components/ZeroBalanceCard';

// Helper function to clean HTML entities
const cleanHtmlEntities = text => {
  if (!text) return '';
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
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

  // Get loading states
  const { pending: billsLoading } = mcp;
  const { isPending: debtsLoading, isPendingVBMS } = debtLetters;
  const dataLoading = billsLoading || debtsLoading || isPendingVBMS;

  const debts = debtLetters.debts || [];
  const bills = mcp.statements || [];

  // Pulling veteran contact information from the Redux store
  const mailingAddress = useSelector(selectVAPMailingAddress);
  const { userFullName = {} } = useSelector(selectProfile);

  // Get additional debt-specific information from the first debt if available
  const fileNumber = debts.length > 0 ? debts[0]?.fileNumber || '' : '';
  const payeeNumber = debts.length > 0 ? debts[0]?.payeeNumber || '' : '';
  const personEntitled = debts.length > 0 ? debts[0]?.personEntitled || '' : '';

  // Today's date formatted
  const todaysDate = format(new Date(), 'MMMM d, yyyy');

  // Data for One VA Debt Letter PDF
  const veteranContactInformation =
    {
      veteranFullName: userFullName,
      addressLine1: (mailingAddress && mailingAddress.addressLine1) || '',
      addressLine2: (mailingAddress && mailingAddress.addressLine2) || '',
      addressLine3: (mailingAddress && mailingAddress.addressLine3) || '',
      city: (mailingAddress && mailingAddress.city) || '',
      zipCode: (mailingAddress && mailingAddress.zipCode) || '',
      stateCode: (mailingAddress && mailingAddress.stateCode) || '',
      fileNumber,
      payeeNumber,
      personEntitled,
    } || {};

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

  const getLatestPaymentDateFromCopayForFacility = statement => {
    let latestPostedDate = last(statement.details)?.pDDatePostedOutput;

    if (latestPostedDate === '') {
      latestPostedDate = statement.pSStatementDateOutput;
    }

    if (!latestPostedDate) {
      return 'N/A';
    }

    return formatDate(latestPostedDate);
  };

  // Get formatted city, state, and zip
  const getFormattedCityStateZip = () => {
    if (!mailingAddress) return '';

    return mailingAddress.city && mailingAddress.stateCode
      ? `${mailingAddress.city}, ${mailingAddress.stateCode} ${
          mailingAddress.zipCode
        }`
      : '';
  };

  // Merge into namespaced pdfData for One VA Debt Letter PDF
  const pdfData = {
    copays: bills || [],
    debts: debts || [],
    veteranContactInformation,
    details: {
      logoUrl: '/img/design/logo/logo-black-and-white.png',
    },
  };

  const showOneVADebtLetterDownloadButton = useMemo(
    () => {
      // 403 error is not enrolled, so bills aren't proper borked
      const billsBorked = billError ? billError?.code !== '403' : false;
      return showOneVADebtLetterDownload && !debtError && !billsBorked;
    },
    [billError, debtError, showOneVADebtLetterDownload],
  );

  // give features a chance to fully load before we conditionally render
  if (togglesLoading || dataLoading) {
    return <VaLoadingIndicator message="Loading features and data..." />;
  }

  const copayTotalRow = copay => {
    return (
      <va-table-row>
        <span className="sr-only">Total row</span>
        <span className="vads-u-text-align--right vads-u-font-weight--bold">
          Total Due:
        </span>
        <span className="vads-u-font-weight--bold">
          {currency(copay.pHAmtDue, 0)}
        </span>
      </va-table-row>
    );
  };

  const copayPreviousBalanceRow = copay => {
    if (!copay.pHPrevBal) return null;

    return (
      <va-table-row>
        <span>Previous Balance</span>
        <span />
        <span>{currency(parseFloat(copay.pHPrevBal || 0), 0)}</span>
      </va-table-row>
    );
  };

  const copayTotalPaymentsCreditsRow = copay => {
    if (!copay.pHTotCredits) return null;

    return (
      <va-table-row>
        <span>Payments Received</span>
        <span />
        <span>{currency(parseFloat(copay.pHTotCredits || 0), 0)}</span>
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
            label: 'Overpayments and copay bills',
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
          <h2
            data-testid="combined-statements-veteran-info"
            className="vads-u-margin-top--0 vads-u-margin-bottom--2 vads-u-font-size--h2"
          >
            Veteran information
          </h2>
          <div className="vads-u-margin-bottom--2">
            <strong className="vads-u-font-size--h4 vads-u-margin-top--2 vads-u-margin-bottom--1">
              Recipient address
            </strong>
            <p
              data-testid="combined-statements-recipient-info"
              className="vads-u-margin-top--0 vads-u-margin-bottom--1"
            >
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
              File number: {fileNumber}
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

        <div className="vads-u-margin-y--4 vads-u-padding-y--2">
          <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Copay charges
          </h2>
          {bills && bills.length > 0 ? (
            <>
              <p className="vads-u-margin-top--0">
                You’re receiving this billing statement because you are
                currently enrolled in a priority group requiring copayments for
                treatment of non-service connected conditions.
              </p>

              <div className="vads-u-margin-top--3">
                <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--1">
                  Resolve your copay bills
                </h3>
                <p className="vads-u-margin-top--0">
                  You can pay your debt online, by phone, or by mail. Call us at{' '}
                  <va-telephone contact="8664001238" /> to discuss payment
                  options, request financial help, or dispute your bill.
                </p>

                <va-link-action
                  href="/manage-va-debt/summary/copay-balances"
                  text="Review and resolve copay bills"
                  type="secondary"
                  data-testid="review-copays-link"
                />
              </div>
            </>
          ) : null}

          {/* Copay charges tables */}
          {bills && bills.length > 0 ? (
            bills.map(statement => (
              <div key={statement.station.facilityName}>
                <h3>{statement.station.facilityName}</h3>
                <p className="vads-u-margin-bottom--0">
                  Payments made after{' '}
                  {getLatestPaymentDateFromCopayForFacility(statement)} will not
                  be reflected here
                </p>

                <va-table
                  table-title={`Copay charges for ${
                    statement.station.facilityName
                  }`}
                  data-testid={`combined-statements-copay-table-${
                    statement.station.facilityName
                  }`}
                  className="vads-u-width--full"
                >
                  <va-table-row slot="headers">
                    <span>Description</span>
                    <span>Billing reference</span>
                    <span>Amount</span>
                  </va-table-row>
                  {copayPreviousBalanceRow(statement)}

                  {statement.details &&
                    statement.details.map((charge, idx) => (
                      <va-table-row key={idx}>
                        <span>
                          {cleanHtmlEntities(charge.pDTransDescOutput)}
                        </span>
                        <span>{charge.pDRefNo}</span>
                        <span>{currency(charge.pDTransAmt, 0)}</span>
                      </va-table-row>
                    ))}

                  {statement?.pHTotCredits !== 0 &&
                    copayTotalPaymentsCreditsRow(statement)}
                  {copayTotalRow(statement)}
                </va-table>
              </div>
            ))
          ) : (
            <ZeroBalanceCard appType={APP_TYPES.COPAY} />
          )}
        </div>

        <div className="vads-u-margin-y--4 vads-u-padding-y--2">
          <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Overpayment charges
          </h2>
          {debts && debts.length > 0 ? (
            <>
              <p className="vads-u-margin-top--0">
                Benefit overpayments are due to changes in your benefits which
                result in you being paid more than you were owed.
              </p>
              <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--1">
                Resolve overpayments
              </h3>
              <p className="vads-u-margin-top--0">
                You can pay your debt online, by phone, or by mail. Call us at{' '}
                <va-telephone contact="8008270648" /> to discuss payment
                options, request financial help, or dispute your bill.
              </p>

              <va-link-action
                href="/manage-va-debt/summary/debt-balances"
                text="Review and resolve overpayments"
                type="secondary"
                data-testid="review-debts-link"
              />

              <p className="vads-u-margin-bottom--3">
                Most recent payment may not be reflected here.
              </p>
            </>
          ) : null}

          {debts && debts.length > 0 ? (
            <va-table
              table-type="borderless"
              table-title="Overpayment charges"
              className="vads-u-width--full vads-u-margin-x--0"
              data-testid="combined-statements-debt-table"
            >
              <va-table-row slot="headers">
                <span>Date</span>
                <span>Description</span>
                <span>Amount</span>
              </va-table-row>

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
                    <span>{currency(debtAmount, 0)}</span>
                  </va-table-row>
                );
              })}

              <va-table-row>
                <span className="sr-only">Total row</span>
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
                    0,
                  )}
                </span>
              </va-table-row>
            </va-table>
          ) : (
            <ZeroBalanceCard appType={APP_TYPES.DEBT} />
          )}
        </div>
        <Modals title="Notice of rights and responsibilities" id="notice-modal">
          <Modals.Rights />
        </Modals>
      </div>
    </>
  );
};

export default CombinedStatements;
