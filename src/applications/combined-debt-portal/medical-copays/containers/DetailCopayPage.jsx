import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Modals from '../../combined/components/Modals';
import StatementTable from '../components/StatementTable';
import DownloadStatement from '../components/DownloadStatement';
import StatementCharges from '../components/StatementCharges';
import HTMLStatementList from '../components/HTMLStatementList';
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

  const copayDetail =
    useSelector(state => state.combinedPortal.mcp.selectedStatement) || {};
  const isCopayDetailLoading = useSelector(
    state => state.combinedPortal.mcp.isCopayDetailLoading,
  );
  const allStatements =
    useSelector(state => state.combinedPortal.mcp.statements) || [];

  const selectedId = match.params.id;
  const selectedCopay = shouldShowVHAPaymentHistory
    ? copayDetail
    : allStatements?.find(({ id }) => id === selectedId);

  const copayAttributes = useMemo(
    () => {
      if (!copayDetail?.id) return DEFAULT_COPAY_ATTRIBUTES;

      /* eslint-disable no-nested-ternary */
      return shouldShowVHAPaymentHistory
        ? {
            TITLE: `Copay bill for ${copayDetail?.attributes.facility.name}`,
            INVOICE_DATE: verifyCurrentBalance(
              copayDetail?.attributes.invoiceDate,
            ),
            ACCOUNT_NUMBER: copayDetail?.attributes.accountNumber,
            CHARGES: copayDetail?.attributes?.lineItems ?? [],
          }
        : {
            TITLE: `Copay bill for ${copayDetail?.station.facilityName}`,
            INVOICE_DATE: verifyCurrentBalance(
              copayDetail?.pSStatementDateOutput,
            ),
            ACCOUNT_NUMBER:
              copayDetail?.accountNumber || copayDetail?.pHAccountNumber,
            CHARGES:
              copayDetail?.details?.filter(
                charge => !charge.pDTransDescOutput.startsWith('&nbsp;'),
              ) ?? [],
          };
      /* eslint-disable no-nested-ternary */
    },
    [copayDetail?.id, shouldShowVHAPaymentHistory],
  );

  // Handle alert separately
  useEffect(
    () => {
      if (copayDetail?.id && !copayAttributes.INVOICE_DATE) {
        setAlert('past-due-balance');
      }
    },
    [copayDetail?.id, copayAttributes.INVOICE_DATE],
  );

  useEffect(
    () => {
      if (!isAnyElementFocused()) setPageFocus();

      if (
        !copayDetail?.id &&
        copayDetail.id !== selectedId &&
        !isCopayDetailLoading &&
        shouldShowVHAPaymentHistory
      ) {
        dispatch(getCopayDetailStatement(`${selectedId}`));
      }
    },
    [
      selectedId,
      dispatch,
      copayDetail?.id,
      isCopayDetailLoading,
      shouldShowVHAPaymentHistory,
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

    if (!selectedCopay?.pSStatementDateOutput) return null;

    // Statement date is in MM/DD/YYYY format
    const [month, day, year] = selectedCopay.pSStatementDateOutput.split('/');

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

  if (!selectedCopay?.id || isCopayDetailLoading) {
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
            href: `/manage-va-debt/summary/copay-balances/${selectedId}`,
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
          <CopayAlertContainer type={alert} copay={selectedCopay} />
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
                    ? selectedCopay.attributes?.principalBalance
                    : selectedCopay.pHNewBalance,
                )}
              </dd>
            </div>
            <div className="vads-u-display--flex vads-u-flex-direction--row">
              <dt>Payment due:</dt>
              <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                {shouldShowVHAPaymentHistory
                  ? selectedCopay.attributes?.paymentDueDate
                  : formatDate(getPaymentDueDate())}
              </dd>
            </div>
            {copayAttributes.CHARGES.length > 0 ? null : (
              <div className="vads-u-display--flex vads-u-flex-direction--row">
                <dt>New charges:</dt>
                <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                  {formatCurrency(
                    shouldShowVHAPaymentHistory
                      ? selectedCopay.attributes.principalPaid
                      : selectedCopay.pHTotCharges,
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
              selectedCopay={selectedCopay}
            />
          ) : (
            <StatementCharges
              copay={selectedCopay}
              showCurrentStatementHeader
            />
          )}
          <DownloadStatement
            key={selectedId}
            statementId={selectedId}
            statementDate={
              shouldShowVHAPaymentHistory
                ? formatISODateToMMDDYYYY(copayAttributes.INVOICE_DATE)
                : selectedCopay.pSStatementDate
            }
            fullName={fullName}
          />
        </div>
        <HTMLStatementList selectedId={selectedId} />
        <StatementAddresses
          data-testid="statement-addresses"
          copay={selectedCopay}
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
