import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
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
} from '../../combined/utils/helpers';

import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';
import CopayAlertContainer from '../components/CopayAlertContainer';

const DetailCopayPage = ({ match }) => {
  const [alert, setAlert] = useState('status');
  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );

  // Get the selected copay statement ID from the URL
  //  and the selected copay statement data from Redux
  const selectedId = match.params.id;
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  const selectedCopay = shouldShowVHAPaymentHistory
    ? statements?.data
    : statements?.find(({ id }) => id === selectedId);

  // Get selected copay statement data
  const title = `Copay bill for ${
    shouldShowVHAPaymentHistory
      ? selectedCopay?.attributes.facility
      : selectedCopay?.station.facilityName
  }`;
  const isCurrentBalance = verifyCurrentBalance(
    shouldShowVHAPaymentHistory
      ? selectedCopay?.attributes.invoiceDate
      : selectedCopay?.pSStatementDateOutput,
  );
  const acctNum = shouldShowVHAPaymentHistory
    ? selectedCopay?.attributes.accountNumber
    : selectedCopay?.accountNumber || selectedCopay?.pHAccountNumber;

  // get veteran name
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName?.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  const getPaymentDueDate = () => {
    if (shouldShowVHAPaymentHistory) {
      return selectedCopay.attributes.invoiceDate;
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

  const charges = shouldShowVHAPaymentHistory
    ? selectedCopay?.attributes?.lineItems ?? []
    : selectedCopay?.details?.filter(
        charge => !charge.pDTransDescOutput.startsWith('&nbsp;'),
      ) ?? [];

  const formatCurrency = amount => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  useHeaderPageTitle(title);

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  useEffect(
    () => {
      if (!isCurrentBalance) {
        setAlert('past-due-balance');
      }
    },
    [isCurrentBalance],
  );

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
            label: title,
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
          {title}
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
                    ? selectedCopay?.attributes?.principalBalance
                    : selectedCopay?.pHNewBalance,
                )}
              </dd>
            </div>
            <div className="vads-u-display--flex vads-u-flex-direction--row">
              <dt>Payment due:</dt>
              <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                {shouldShowVHAPaymentHistory
                  ? selectedCopay?.attributes?.paymentDueDate
                  : formatDate(getPaymentDueDate())}
              </dd>
            </div>
            {charges.length > 0 ? null : (
              <div className="vads-u-display--flex vads-u-flex-direction--row">
                <dt>New charges:</dt>
                <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                  {formatCurrency(
                    shouldShowVHAPaymentHistory
                      ? selectedCopay?.attributes?.principalPaid
                      : selectedCopay.pHTotCharges,
                  )}
                </dd>
              </div>
            )}
          </dl>
          <h2 className="vads-u-margin-top--2 vads-u-font-size--h3">
            Account number
          </h2>
          <p className="vads-u-margin--0">{acctNum}</p>
        </div>
        <div className="vads-u-margin-y--4">
          {/* Show VHA Lighthouse data | or Current CDW Statement */}
          {shouldShowVHAPaymentHistory ? (
            <StatementTable
              charges={charges}
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
                ? formatISODateToMMDDYYYY(selectedCopay?.attributes.invoiceDate)
                : selectedCopay?.pSStatementDate
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

DetailCopayPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default DetailCopayPage;
