import React, { useEffect } from 'react';
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

const getBreadcrumbs = (statementAttributes) => (
  [
    {
      href: '/',
      label: 'Home',
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
      href: `/manage-va-debt/summary/copay-balances/${statementAttributes.latestCopay.copayId}`,
      label: `${statementAttributes.prevPage}`,
    },
    {
      href: `/manage-va-debt/summary/copay-balances/${statementAttributes.latestCopay.copayId}/statement`,
      label: `${statementAttributes.title}`,
    },
  ]
);

const DEFAULT_STATEMENT_ATTRIBUTES = {
  LATEST_COPAY: {},
  TITLE: '',
  DATE: '',
  PREV_PAGE: '',
  ACCOUNT_NUMBER: '',
  CHARGES: [],
  CURRENT_BALANCE: '',
  PAYMENTS_RECEIVED: ''
}

const HTMLStatementPage = () => {
  const shouldUseLighthouseCopays = useSelector(useLighthouseCopays);

  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName.middle
  ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
  : `${userFullName.first} ${userFullName.last}`;
  
  const { statementCopays, isLoading } = useCurrentStatement();

  const dateIsValid = () => (
    isValid(parsedStatementDate) ? format(parsedStatementDate, 'MMMM d'): ''
  )
  
  const getLatestCopay = () => {
    return statementCopays.at(-1);
  }
  // change to i18 if can
  const getPrevPage = facilityName => `Copay bill for ${facilityName}`
  const title = statementDate => `${statementDate} statement`;

  const getLegacyAttributes = () => {
    const latestCopay = getLatestCopay();
    const statementDate = latestCopay.pSStatementDateOutput;
    const statementCharges = statementCopays.flatMap(copay => getCopayCharge(copay));
    const rawCurrentBalance = statementCharges.reduce((sum, charge) => sum + charge.pDTransAmt);
    const formattedCurrentBalance = formatCurrency(rawCurrentBalance);
    const payments_received = statementCopays.reduce((sum, copay) => sum + copay.pHTotCharges);

    return {
      LATEST_COPAY: latestCopay,
      TITLE: title(statementDate),
      DATE: statementDate,
      PREV_PAGE: getPrevPage(latestCopay.station.facilityName),
      ACCOUNT_NUMBER: latestCopay?.accountNumber || selectedCopay?.pHAccountNumber,
      CHARGES: statementCharges,
      CURRENT_BALANCE: formattedCurrentBalance,
      PAYMENTS_RECEIVED: payments_received
    } 
  }

  // see about putting all these gets in the helper - gonna have diff chargest logic, maybe diff title
  const getLighthouseAttributes = () => {
    const latestCopay = getLatestCopay();
    const statementDate = formatISODateToMMDDYYYY(currentCopay.attributes.invoiceDate);
    const statementCharges = statementCopays.flatMap(copay => copay.attributes.lineItems)
    const currentSumBalance = statementCharges.reduce((sum, charge) => sum + charge.pDTransAmt);
    const formattedCurrentBalance = formatCurrency(currentSumBalance);
    const payments_received = statementCopays.reduce((sum, copay) => sum + copay.attributes.principalPaid);

    return {
      LATEST_COPAY: latestCopay,
      TITLE: title(statementDate),
      DATE: statementDate,
      PREV_PAGE: getPrevPage(latestCopay.attributes.facility.name),
      ACCOUNT_NUMBER: latestCopay.attributes.accountNumber,
      CHARGES: statementCharges,
      CURRENT_BALANCE: formattedCurrentBalance,
      PAYMENTS_RECEIVED: payments_received
    }
  }

  const statementAttributes = useMemo(() => {
    if (!statementCopays?.length > 0) return DEFAULT_STATEMENT_ATTRIBUTES;
    return shouldUseLighthouseCopays ?  getLighthouseAttributes() : getLegacyAttributes();
  }, [statementCopays[0]?.id, shouldUseLighthouseCopays]);

  useHeaderPageTitle(title);

  useEffect(() => {
    if (!isAnyElementFocused()) setPageFocus();
  }, []);

  if (!currentCopay?.id || isLoading) {
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
        <h1 data-testid="statement-page-title">{title}</h1>
        <p className="va-introtext" data-testid="facility-name">
          {`${currentCopay?.station.facilityName}`}
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
          selectedId={statementId}
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

HTMLStatementPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

export default HTMLStatementPage;
