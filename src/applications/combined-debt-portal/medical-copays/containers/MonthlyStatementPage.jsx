import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import {
  VaBreadcrumbs,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  setPageFocus,
  isAnyElementFocused,
  formatCurrency,
  formatISODateToMMDDYYYY,
  getCopayCharge
} from '../../combined/utils/helpers';
import { useCurrentStatement, useLighthouseCopays } from '../../combined/utils/selectors';
import Modals from '../../combined/components/Modals';
import StatementAddresses from '../components/StatementAddresses';
import AccountSummary from '../components/AccountSummary';
import StatementTable from '../components/StatementTable';
import DownloadStatement from '../components/DownloadStatement';
import NeedHelpCopay from '../components/NeedHelpCopay';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const getBreadcrumbs = (statementAttributes) => {
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
      href: `/manage-va-debt/summary/copay-balances/${latestCopay.statement_id}/statement`,
      label: statementAttributes.TITLE,
    },
  ];
};

const DEFAULT_STATEMENT_ATTRIBUTES = {
  LATEST_COPAY: {},
  TITLE: '',
  DATE: '',
  PREV_PAGE: '',
  ACCOUNT_NUMBER: '',
  CHARGES: [],
  CURRENT_BALANCE: '',
  PAYMENTS_RECEIVED: '',
  NEW_CHARGES: 0,
};

const MonthlyStatementPage = () => {
  const { id: statementId } = useParams();
  const shouldUseLighthouseCopays = useSelector(useLighthouseCopays);

  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName?.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName?.first || ''} ${userFullName?.last || ''}`.trim();

  const { statementCopays, isLoading } = useCurrentStatement();

  const getLatestCopay = () => statementCopays?.at(-1) ?? null;
  const latestCopay = getLatestCopay();

  const dateIsValid = (dateStr = '') => {
    if (!dateStr) return '';
    const parsed = new Date(dateStr.replace(/-/g, '/'));
    return isValid(parsed) ? format(parsed, 'MMMM d') : '';
  };

  const getPrevPage = facilityName => `Copay bill for ${facilityName}`;
  const title = statementDate => `${statementDate} statement`;

  const getLegacyAttributes = () => {
    const latest = getLatestCopay();
    const statementDate = latest?.pSStatementDateOutput;
    const statementCharges = statementCopays.flatMap(copay => getCopayCharge(copay));
    const rawCurrentBalance = statementCharges.reduce(
      (sum, charge) => sum + (charge.pDTransAmt || 0),
      0,
    );
    const paymentsReceived = statementCopays.reduce(
      (sum, copay) => sum + (copay.pHTotCharges || 0),
      0,
    );

    return {
      LATEST_COPAY: latest,
      TITLE: title(statementDate),
      DATE: statementDate,
      PREV_PAGE: getPrevPage(latest?.station?.facilityName || ''),
      ACCOUNT_NUMBER: latest?.accountNumber || '',
      CHARGES: statementCharges,
      CURRENT_BALANCE: formatCurrency(rawCurrentBalance),
      PAYMENTS_RECEIVED: paymentsReceived,
      NEW_CHARGES: rawCurrentBalance,
    };
  };

  const getLighthouseAttributes = () => {
    const latest = getLatestCopay();
    const statementDate = latest?.attributes?.invoiceDate
      ? formatISODateToMMDDYYYY(latest.attributes.invoiceDate)
      : '';
    const statementCharges =
      statementCopays.flatMap(copay => copay.attributes?.lineItems || []) || [];
    const currentSumBalance = statementCharges.reduce(
      (sum, charge) => sum + (charge.pDTransAmt || 0),
      0,
    );
    const paymentsReceived = statementCopays.reduce(
      (sum, copay) => sum + (copay.attributes?.principalPaid || 0),
      0,
    );

    return {
      LATEST_COPAY: latest,
      TITLE: title(statementDate),
      DATE: statementDate,
      PREV_PAGE: getPrevPage(latest?.attributes?.facility?.name || ''),
      ACCOUNT_NUMBER: latest?.attributes?.accountNumber || '',
      CHARGES: statementCharges,
      CURRENT_BALANCE: formatCurrency(currentSumBalance),
      PAYMENTS_RECEIVED: paymentsReceived,
      NEW_CHARGES: currentSumBalance,
    };
  };

  const statementAttributes = useMemo(() => {
    if (!statementCopays?.length) return DEFAULT_STATEMENT_ATTRIBUTES;
    return shouldUseLighthouseCopays
      ? getLighthouseAttributes()
      : getLegacyAttributes();
  }, [statementCopays?.length, statementCopays?.[0]?.id, shouldUseLighthouseCopays]);

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
          newCharges={statementAttributes.NEW_CHARGES}
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
          fullName={fullName}
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

MonthlyStatementPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default MonthlyStatementPage;
