import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Modals from '../../combined/components/Modals';
import StatementTable from '../components/StatementTable';
import DownloadStatement from '../components/DownloadStatement';
import StatementCharges from '../components/StatementCharges';
import PreviousStatements from '../components/PreviousStatements';
import StatementAddresses from '../components/StatementAddresses';
import NeedHelpCopay from '../components/NeedHelpCopay';
import {
  showVHAPaymentHistory,
  formatDate,
  verifyCurrentBalance,
  setPageFocus,
  formatISODateToMMDDYYYY,
  isAnyElementFocused,
  DEFAULT_COPAY_ATTRIBUTES,
} from '../../combined/utils/helpers';
import { getCopayDetailStatement } from '../../combined/actions/copays';

import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';
import CopayAlertContainer from '../components/CopayAlertContainer';

const DetailCopayPage = ({ match }) => {
  const dispatch = useDispatch();

  const [alert, setAlert] = useState('status');
  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );

  const { currentStatement, shouldFetchStatement } = useCurrentStatement(statementId);

  const copayAttributes = useMemo(
    () => {
      if (!currentStatement?.id) return DEFAULT_COPAY_ATTRIBUTES;

      /* eslint-disable no-nested-ternary */
      return shouldShowVHAPaymentHistory
        ? {
            TITLE: `Copay bill for ${currentStatement?.attributes.facility.name}`,
            INVOICE_DATE: currentStatement?.attributes?.invoiceDate,
            IS_CURRENT_DATE: verifyCurrentBalance(
              currentStatement?.attributes.invoiceDate,
            ),
            ACCOUNT_NUMBER: currentStatement?.attributes.accountNumber,
            CHARGES: currentStatement?.attributes?.lineItems ?? [],
          }
        : {
            TITLE: `Copay bill for ${currentStatement?.station.facilityName}`,
            INVOICE_DATE: currentStatement?.pSStatementDateOutput,
            IS_CURRENT_DATE: verifyCurrentBalance(
              currentStatement?.pSStatementDateOutput,
            ),
            ACCOUNT_NUMBER:
              currentStatement?.accountNumber || currentStatement?.pHAccountNumber,
            CHARGES:
              currentStatement?.details?.filter(
                charge => !charge.pDTransDescOutput.startsWith('&nbsp;'),
              ) ?? [],
          };
      /* eslint-disable no-nested-ternary */
    },
    [currentStatement?.id, shouldShowVHAPaymentHistory],
  );

  // Handle alert separately
  useEffect(
    () => {
      if (!currentStatement?.id) return;
      setAlert(copayAttributes.IS_CURRENT_DATE ? 'status' : 'past-due-balance');
    },
    [currentStatement?.id, copayAttributes],
  );

  useEffect(
    () => {
      if (!isAnyElementFocused()) setPageFocus();
      if (shouldFetchStatement) dispatch(getCopayDetailStatement(statementId));
    },
    [
      statementId,
      dispatch,
      shouldFetchStatement
    ],
  );

  // get veteran name
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName?.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  const getPaymentDueDate = () => {
    if (shouldShowVHAPaymentHistory) {
      return copayAttributes.INVOICE_DATE;
    }

    if (!currentStatement?.pSStatementDateOutput) return null;

    // Statement date is in MM/DD/YYYY format
    const [month, day, year] = currentStatement.pSStatementDateOutput.split('/');

    // Create date and add 30 days
    const date = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10));
    date.setDate(date.getDate() + 30);

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatCurrency = amount => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  useHeaderPageTitle(copayAttributes.TITLE);

  if (!currentStatement?.id || isCopayDetailLoading) {
    return <VaLoadingIndicator message="Loading features..." />;
  }

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
            href: '/manage-va-debt/summary/copay-balances',
            label: 'Copay balances',
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${statementId}`,
            label: copayAttributes.TITLE,
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1
          data-testid="detail-copay-page-title-otpp"
          className="vads-u-margin-bottom--2"
        >
          {copayAttributes.TITLE}
        </h1>
        <div>
          <CopayAlertContainer type={alert} copay={currentStatement} />
        </div>
        <div className="vads-u-margin-y--4">
          <h2 className="vads-u-margin-top--0 vads-u-font-size--h3">
            Copay details
          </h2>
          <dl className="vads-u-margin--0">
            <div className="vads-u-display--flex vads-u-flex-direction--row">
              <dt>Current balance:</dt>
              <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                {formatCurrency(
                  shouldShowVHAPaymentHistory
                    ? currentStatement.attributes?.principalBalance
                    : currentStatement.pHNewBalance,
                )}
              </dd>
            </div>
            <div className="vads-u-display--flex vads-u-flex-direction--row">
              <dt>Payment due:</dt>
              <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                {shouldShowVHAPaymentHistory
                  ? currentStatement.attributes?.paymentDueDate
                  : formatDate(getPaymentDueDate())}
              </dd>
            </div>
            {copayAttributes.CHARGES.length > 0 ? null : (
              <div className="vads-u-display--flex vads-u-flex-direction--row">
                <dt>New charges:</dt>
                <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                  {formatCurrency(
                    shouldShowVHAPaymentHistory
                      ? currentStatement.attributes.principalPaid
                      : currentStatement.pHTotCharges,
                  )}
                </dd>
              </div>
            )}
          </dl>
          <h2 className="vads-u-margin-top--2 vads-u-font-size--h3">
            Account number
          </h2>
          <p className="vads-u-margin--0">{copayAttributes.ACCOUNT_NUMBER}</p>
        </div>
        <div className="vads-u-margin-y--4">
          {/* Show VHA Lighthouse data | or Current CDW Statement */}
          {shouldShowVHAPaymentHistory ? (
            <StatementTable
              charges={copayAttributes.CHARGES}
              formatCurrency={formatCurrency}
              currentStatement={currentStatement}
            />
          ) : (
            <StatementCharges
              copay={currentStatement}
              showCurrentStatementHeader
            />
          )}
          <DownloadStatement
            key={statementId}
            statementId={statementId}
            statementDate={
              shouldShowVHAPaymentHistory
                ? formatISODateToMMDDYYYY(copayAttributes.INVOICE_DATE)
                : currentStatement.pSStatementDate
            }
            fullName={fullName}
          />
        </div>
        <PreviousStatements statementId={statementId} />
        <StatementAddresses
          data-testid="statement-addresses"
          copay={currentStatement}
        />

        <Modals title="Notice of rights and responsibilities">
          <Modals.Rights />
        </Modals>
        <NeedHelpCopay />
      </div>
    </>
  );
};

export default DetailCopayPage;
