import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Modals from '../../combined/components/Modals';
import StatementTable from '../components/StatementTable';
import DownloadStatement from '../components/DownloadStatement';
import StatementCharges from '../components/StatementCharges';
import PreviousStatements from '../components/PreviousStatements';
import StatementAddresses from '../components/StatementAddresses';
import NeedHelpCopay from '../components/NeedHelpCopay';
import { DEFAULT_COPAY_ATTRIBUTES } from '../../combined/utils/constants';
import {
  formatDate,
  verifyCurrentBalance,
  setPageFocus,
  formatISODateToMMDDYYYY,
  isAnyElementFocused,
} from '../../combined/utils/helpers';
import {
  useCurrentCopay,
  useLighthouseCopays,
} from '../../combined/utils/selectors';

import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';
import CopayAlertContainer from '../components/CopayAlertContainer';

const DetailCopayPage = ({ match }) => {
  const copayId = match?.params?.id;

  const [alert, setAlert] = useState('status');
  const shouldUseLighthouseCopays = useSelector(useLighthouseCopays);
  const { currentCopay, isLoading } = useCurrentCopay();

  const copayAttributes = useMemo(() => {
    if (!currentCopay?.id) return DEFAULT_COPAY_ATTRIBUTES;

    /* eslint-disable no-nested-ternary */
    return shouldUseLighthouseCopays
      ? {
          TITLE: `Copay bill for ${currentCopay?.attributes.facility.name}`,
          INVOICE_DATE: currentCopay?.attributes?.invoiceDate,
          IS_CURRENT_DATE: verifyCurrentBalance(
            currentCopay?.attributes.invoiceDate,
          ),
          ACCOUNT_NUMBER: currentCopay?.attributes.accountNumber,
          CHARGES: currentCopay?.attributes?.lineItems ?? [],
        }
      : {
          TITLE: `Copay bill for ${currentCopay?.station.facilityName}`,
          INVOICE_DATE: currentCopay?.pSStatementDateOutput,
          IS_CURRENT_DATE: verifyCurrentBalance(
            currentCopay?.pSStatementDateOutput,
          ),
          ACCOUNT_NUMBER:
            currentCopay?.accountNumber || currentCopay?.pHAccountNumber,
          CHARGES:
            currentCopay?.details?.filter(
              charge => !charge.pDTransDescOutput.startsWith('&nbsp;'),
            ) ?? [],
        };
    /* eslint-disable no-nested-ternary */
  }, [currentCopay?.id, shouldUseLighthouseCopays]);

  useEffect(
    () => {
      if (!currentCopay?.id) return;
      setAlert(copayAttributes.IS_CURRENT_DATE ? 'status' : 'past-due-balance');
    },
    [currentCopay?.id, copayAttributes],
  );

  useEffect(() => {
    if (!isAnyElementFocused()) setPageFocus();
  }, []);

  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName?.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;

  const getPaymentDueDate = () => {
    if (shouldUseLighthouseCopays) {
      return copayAttributes.INVOICE_DATE;
    }

    if (!currentCopay?.pSStatementDateOutput) return null;

    // Statement date is in MM/DD/YYYY format
    const [month, day, year] = currentCopay.pSStatementDateOutput.split('/');

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

  if (!currentCopay?.id || isLoading) {
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
            href: `/manage-va-debt/summary/copay-balances/${copayId}`,
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
          <CopayAlertContainer type={alert} copay={currentCopay} />
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
                  shouldUseLighthouseCopays
                    ? currentCopay.attributes?.principalBalance
                    : currentCopay.pHNewBalance,
                )}
              </dd>
            </div>
            <div className="vads-u-display--flex vads-u-flex-direction--row">
              <dt>Payment due:</dt>
              <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                {shouldUseLighthouseCopays
                  ? currentCopay.attributes?.paymentDueDate
                  : formatDate(getPaymentDueDate())}
              </dd>
            </div>
            {copayAttributes.CHARGES.length > 0 ? null : (
              <div className="vads-u-display--flex vads-u-flex-direction--row">
                <dt>New charges:</dt>
                <dd className="vads-u-margin-left--1 vads-u-font-weight--bold">
                  {formatCurrency(
                    shouldUseLighthouseCopays
                      ? currentCopay.attributes.principalPaid
                      : currentCopay.pHTotCharges,
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
          {/* Show VHA Lighthouse data | or Current CDW Copay */}
          {shouldUseLighthouseCopays ? (
            <StatementTable
              charges={copayAttributes.CHARGES}
              formatCurrency={formatCurrency}
              selectedCopay={currentCopay}
            />
          ) : (
            <StatementCharges copay={currentCopay} showCurrentCopayHeader />
          )}
          <DownloadStatement
            key={copayId}
            selectedId={copayId}
            statementDate={
              shouldUseLighthouseCopays
                ? formatISODateToMMDDYYYY(copayAttributes.INVOICE_DATE)
                : currentCopay.pSStatementDate
            }
            fullName={fullName}
          />
        </div>
        <PreviousStatements selectedId={copayId} />
        <StatementAddresses
          data-testid="statement-addresses"
          copay={currentCopay}
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
