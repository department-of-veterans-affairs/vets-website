import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { format, isValid } from 'date-fns';
import {
  VaBreadcrumbs,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  setPageFocus,
  isAnyElementFocused,
  formatCurrency,
  formatFullName,
  formatISODateToMMDDYYYY,
  getCopayCharge,
} from '../../combined/utils/helpers';
import { DEFAULT_STATEMENT_ATTRIBUTES } from '../../combined/utils/constants';
import {
  useCurrentStatement,
  useLighthouseCopays,
  selectUserFullName,
} from '../../combined/utils/selectors';
import Modals from '../../combined/components/Modals';
import StatementAddresses from '../components/StatementAddresses';
import AccountSummary from '../components/AccountSummary';
import StatementTable from '../components/StatementTable';
import DownloadStatement from '../components/DownloadStatement';
import NeedHelpCopay from '../components/NeedHelpCopay';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const getBreadcrumbs = statementAttributes => {
  const latestCopay = statementAttributes.LATEST_COPAY || {};
  return [
    { href: '/', label: 'Home' },
    { href: '/manage-va-debt/summary', label: 'Overpayments and copay bills' },
    { href: '/manage-va-debt/summary/copay-balances', label: 'Copay balances' },
    {
      href: `/manage-va-debt/summary/copay-balances/${latestCopay.id}`,
      label: statementAttributes.PREV_PAGE,
    },
    {
      href: `/manage-va-debt/summary/copay-balances/${
        latestCopay.statement_id
      }/statement`,
      label: statementAttributes.TITLE,
    },
  ];
};

const MonthlyStatementPage = () => {
  const { id: statementId } = useParams();
  const shouldUseLighthouseCopays = useSelector(useLighthouseCopays);
  const userFullName = useSelector(selectUserFullName);
  const { statementCopays, isLoading } = useCurrentStatement();

  const getLatestCopay = () => statementCopays?.at(-1) ?? null;
  const latestCopay = getLatestCopay();

  const dateIsValid = (dateStr = '') => {
    if (!dateStr) return '';
    const parsed = new Date(dateStr.replace(/-/g, '/'));
    return isValid(parsed) ? format(parsed, 'MMMM d') : '';
  };

  const formatDateAsMonth = (dateStr = '') => {
    if (!dateStr) return { display: '', firstOfMonthOriginalFormat: '' };
    const parsed = new Date(dateStr.replace(/-/g, '/'));
    // Bill is for the previous month; show the next month (e.g. May statement → June 1)
    const firstOfNextMonth = new Date(
      parsed.getFullYear(),
      parsed.getMonth() + 1,
      1,
    );
    return {
      display: format(firstOfNextMonth, 'MMMM d, yyyy'),
      firstOfMonthOriginalFormat: format(firstOfNextMonth, 'MM/dd/yyyy'),
    };
  };

  const getPrevPage = facilityName => `Copay bill for ${facilityName}`;
  const title = dateLabel => `${dateLabel} statement`;

  const getLegacyAttributes = () => {
    const latest = getLatestCopay();
    const statementDate = latest?.pSStatementDateOutput;
    const dateInfo = formatDateAsMonth(statementDate);
    const statementCharges = statementCopays.flatMap(copay =>
      getCopayCharge(copay),
    );
    const chargeSum = statementCharges.reduce(
      (sum, charge) => sum + (charge.pDTransAmt || 0),
      0,
    );
    const paymentsReceived = statementCopays.reduce(
      (sum, copay) => sum + (copay.pHTotCharges || 0),
      0,
    );
    const currentBalance = chargeSum - paymentsReceived;

    return {
      LATEST_COPAY: latest,
      TITLE: title(dateInfo.display),
      DATE: dateInfo.firstOfMonthOriginalFormat,
      PREV_PAGE: getPrevPage(latest?.station?.facilityName || ''),
      ACCOUNT_NUMBER: latest?.accountNumber || '',
      CHARGES: statementCharges,
      CURRENT_BALANCE: currentBalance,
      PAYMENTS_RECEIVED: paymentsReceived,
    };
  };

  const getLighthouseAttributes = () => {
    const latest = getLatestCopay();
    const statementDate = latest?.attributes?.invoiceDate
      ? formatISODateToMMDDYYYY(latest.attributes.invoiceDate)
      : '';
    const dateInfo = formatDateAsMonth(statementDate);
    const statementCharges =
      statementCopays.flatMap(copay => copay.attributes?.lineItems || []) || [];
    const chargeSum = statementCharges.reduce(
      (sum, charge) => sum + charge.priceComponents[0].amount,
      0,
    );
    const paymentsReceived = statementCopays.reduce(
      (sum, copay) => sum + (copay.attributes?.principalPaid || 0),
      0,
    );
    const currentBalance = chargeSum - paymentsReceived;

    return {
      LATEST_COPAY: latest,
      TITLE: title(dateInfo.display),
      DATE: dateInfo.firstOfMonthOriginalFormat,
      PREV_PAGE: getPrevPage(latest?.attributes?.facility?.name || ''),
      ACCOUNT_NUMBER: latest?.attributes?.accountNumber || '',
      CHARGES: statementCharges,
      CURRENT_BALANCE: currentBalance,
      PAYMENTS_RECEIVED: paymentsReceived,
    };
  };

  const statementCopaysLength = statementCopays?.length;
  const firstCopayId = statementCopays?.[0]?.id;
  const statementAttributes = useMemo(
    () => {
      if (!statementCopays?.length) return DEFAULT_STATEMENT_ATTRIBUTES;
      return shouldUseLighthouseCopays
        ? getLighthouseAttributes()
        : getLegacyAttributes();
    },
    // getLegacyAttributes/getLighthouseAttributes close over statementCopays; deps sufficient for cache invalidation
    [statementCopaysLength, firstCopayId, shouldUseLighthouseCopays], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useHeaderPageTitle(statementAttributes.TITLE);

  useEffect(() => {
    if (!isAnyElementFocused()) setPageFocus();
  }, []);

  if (isLoading || !statementCopays?.length) {
    return <VaLoadingIndicator message="Loading features..." />;
  }

  return (
    <>
      <VaBreadcrumbs
        breadcrumbList={getBreadcrumbs(statementAttributes)}
        label="Breadcrumb"
        wrapping
      />
      <article className="vads-u-padding--0 medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="statement-page-title">{statementAttributes.TITLE}</h1>
        <p className="va-introtext" data-testid="facility-name">
          {latestCopay?.station?.facilityName ||
            latestCopay?.attributes?.facility?.name ||
            ''}
        </p>
        <AccountSummary
          acctNum={statementAttributes.ACCOUNT_NUMBER}
          currentBalance={statementAttributes.CURRENT_BALANCE}
          paymentsReceived={statementAttributes.PAYMENTS_RECEIVED}
        />
        {shouldUseLighthouseCopays && (
          <StatementTable
            charges={statementAttributes.CHARGES}
            formatCurrency={formatCurrency}
            selectedCopay={latestCopay}
          />
        )}
        <DownloadStatement
          key={statementId}
          statementId={statementId}
          statementDate={dateIsValid(statementAttributes.DATE)}
          fullName={formatFullName(userFullName)}
        />
        <StatementAddresses
          data-testid="statement-addresses"
          copay={latestCopay}
        />
        <Modals title="Notice of rights and responsibilities">
          <Modals.Rights />
        </Modals>
        <NeedHelpCopay />
      </article>
    </>
  );
};

export default MonthlyStatementPage;
