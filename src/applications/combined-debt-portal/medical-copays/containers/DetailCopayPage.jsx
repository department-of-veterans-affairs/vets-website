import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
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
} from '../../combined/utils/helpers';
import { getCopayDetailStatement } from '../../combined/actions/copays';

import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';
import CopayAlertContainer from '../components/CopayAlertContainer';

const DEFAULT_COPAY_STATEMENT = {
  TITLE: 'title',
  INVOICE_DATE: 'invoiceDate',
  ACCOUNT_NUMBER: 'accountNumber',
  CHARGES: [],
  FULL_DETAILS: {},
};

const DetailCopayPage = ({ match }) => {
  const [alert, setAlert] = useState('status');
  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );

  // const [isLoading, setIsLoading] = useState(false);

  const [selectedStatement, setSelectedStatement] = useState(
    DEFAULT_COPAY_STATEMENT,
  );

  // const currentState = useSelector(state => state);

  // console.log('CURRENT STATE: ', currentState);

  // Get the selected copay statement ID from the URL
  //  and the selected copay statement data from Redux
  // const selectedStatement =
  //   useSelector(state => state.combinedPortal.mcp.selectedStatement) || {};
  const allStatements =
    useSelector(state => state.combinedPortal.mcp.statements) || [];

  // console.log('ALL STATEMENTS', allStatements);

  const selectedId = match.params.id;
  const selectedCopay = shouldShowVHAPaymentHistory
    ? selectedStatement
    : allStatements?.find(({ id }) => id === selectedId);

  // Get selected copay statement data
  // console.log('DETAIL PAGE SELECTED COPAY: ', selectedCopay);

  useEffect(
    () => {
      // console.log('INSIDE USEEFFECT');
      if (!isAnyElementFocused()) setPageFocus();
      const setCopayDetail = copay => {
        // console.log('SETTING COPAY DETAIL');
        const title = `Copay bill for ${
          shouldShowVHAPaymentHistory
            ? copay?.attributes.facility
            : copay?.station.facilityName
        }`;
        const invoiceDate = verifyCurrentBalance(
          shouldShowVHAPaymentHistory
            ? copay?.attributes.invoiceDate
            : copay?.pSStatementDateOutput,
        );
        const acctNum = shouldShowVHAPaymentHistory
          ? copay?.attributes.accountNumber
          : copay?.accountNumber || copay?.pHAccountNumber;

        const charges = shouldShowVHAPaymentHistory
          ? copay?.attributes?.lineItems ?? []
          : copay?.details?.filter(
              charge => !charge.pDTransDescOutput.startsWith('&nbsp;'),
            ) ?? [];

        setSelectedStatement({
          TITLE: title,
          INVOICE_DATE: invoiceDate,
          ACCOUNT_NUMBER: acctNum,
          CHARGES: charges,
          FULL_DETAILS: copay,
        });
      };

      // console.log('BEFORE SELECTION', selectedCopay);
      const fetchCopayDetail = async () => {
        // console.log('FETCHING COPAY DETAIL');
        if (!selectedCopay.FULL_DETAILS.id) {
          // console.log('INSIDE IF SELECTION');
          const response = await getCopayDetailStatement(`${selectedId}`);
          setCopayDetail(response);
        }
      };

      fetchCopayDetail();
    },
    [selectedId, selectedCopay, shouldShowVHAPaymentHistory],
  );

  useEffect(
    () => {
      if (!selectedCopay.INVOICE_DATE) {
        setAlert('past-due-balance');
      }
    },
    [selectedCopay.INVOICE_DATE],
  );

  // get veteran name
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName?.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  const getPaymentDueDate = () => {
    if (shouldShowVHAPaymentHistory) {
      return selectedCopay.INVOICE_DATE;
    }

    if (!selectedCopay?.fullDetails.pSStatementDateOutput) return null;

    // Statement date is in MM/DD/YYYY format
    const [
      month,
      day,
      year,
    ] = selectedCopay.fullDetails.pSStatementDateOutput.split('/');

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

  useHeaderPageTitle(selectedStatement.TITLE);

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
            label: selectedStatement.TITLE,
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
          {selectedStatement.TITLE}
        </h1>
        <div>
          <CopayAlertContainer
            type={alert}
            copay={selectedCopay.FULL_DETAILS}
          />
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
                    ? selectedCopay.FULL_DETAILS.attributes?.principalBalance
                    : selectedCopay.FULL_DETAILS.pHNewBalance,
                )}
              </dd>
            </div>
            <div className="vads-u-display--flex vads-u-flex-direction--row">
              <dt>Payment due:</dt>
              <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                {shouldShowVHAPaymentHistory
                  ? selectedCopay.FULL_DETAILS.attributes?.paymentDueDate
                  : formatDate(getPaymentDueDate())}
              </dd>
            </div>
            {selectedCopay.CHARGES.length > 0 ? null : (
              <div className="vads-u-display--flex vads-u-flex-direction--row">
                <dt>New charges:</dt>
                <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                  {formatCurrency(
                    shouldShowVHAPaymentHistory
                      ? selectedCopay.FULL_DETAILS.attributes.principalPaid
                      : selectedCopay.FULL_DETAILS.pHTotCharges,
                  )}
                </dd>
              </div>
            )}
          </dl>
          <h2 className="vads-u-margin-top--2 vads-u-font-size--h3">
            Account number
          </h2>
          <p className="vads-u-margin--0">{selectedStatement.ACCOUNT_NUMBER}</p>
        </div>
        <div className="vads-u-margin-y--4">
          {/* Show VHA Lighthouse data | or Current CDW Statement */}
          {shouldShowVHAPaymentHistory ? (
            <StatementTable
              charges={selectedCopay.CHARGES}
              formatCurrency={formatCurrency}
              selectedCopay={selectedCopay.FULL_DETAILS}
            />
          ) : (
            <StatementCharges
              copay={selectedCopay.FULL_DETAILS}
              showCurrentStatementHeader
            />
          )}
          <DownloadStatement
            key={selectedId}
            statementId={selectedId}
            statementDate={
              shouldShowVHAPaymentHistory
                ? formatISODateToMMDDYYYY(selectedCopay.INVOICE_DATE)
                : selectedCopay.FULL_DETAILS.pSStatementDate
            }
            fullName={fullName}
          />
        </div>
        <HTMLStatementList selectedId={selectedId} />
        <StatementAddresses
          data-testid="statement-addresses"
          copay={selectedCopay.FULL_DETAILS}
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
