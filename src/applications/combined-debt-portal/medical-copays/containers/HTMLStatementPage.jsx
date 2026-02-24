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
} from '../../combined/utils/helpers';
import { useCurrentStatement } from '../../combined/utils/selectors';
import Modals from '../../combined/components/Modals';
import StatementAddresses from '../components/StatementAddresses';
import AccountSummary from '../components/AccountSummary';
import StatementTable from '../components/StatementTable';
import DownloadStatement from '../components/DownloadStatement';
import NeedHelpCopay from '../components/NeedHelpCopay';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const DEFAULT_STATEMENT_ATTRIBUTES = {
  LATEST_COPAY: {},
  TITLE: '',
  DATE: '',
  PREV_PAGE: '',
  ACCOUNT_NUMBER: '',
  CHARGES: []
}

const HTMLStatementPage = () => {
  const shouldUseLighthouseCopays = useSelector(useCurrentStatement);

  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const fullName = userFullName.middle
  ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
  : `${userFullName.first} ${userFullName.last}`;
  
  const { id: copayId } = useParams();
  const { statementCopays, isLoading } = useCurrentStatement();

  const getLegacyStatementDate = () => {
    // need to add logic here to make it the month of the statement, not of the copay

    // using statementDateOutput since it has delimiters ('/') unlike pSStatementDate
    const parsedStatementDate = new Date(latestCopay.pSStatementDateOutput);
    // like in copay detail page, this logic got combined and it should be separated
    return isValid(parsedStatementDate)
      ? format(parsedStatementDate, 'MMMM d')
      : '';

    // for lighthouse
    // currentCopay?.attributes?.invoiceDate
  }

  const getLatestCopay = () => {
    return statementCopays.at(-1);
  }

  // change to i18 if can
  const getPrevPage = (facilityName) => {
    return `Copay bill for ${facilityName}`
  }

  const getLegacyAttributes = (latestCopay) => {
    const latestCopay = getLatestCopay();
    const statementDate = getLegacyStatementDate();
    const latestCopayCharges = latestCopay?.details?.filter(
      charge => !charge.pDTransDescOutput.startsWith('&nbsp;'),
    );
    // loop through copays using latestCopayCharges logic to get them all
    const allCharges = latestCopayCharges;

    return {
      LATEST_COPAY: latestCopay,
      TITLE: `${statementDate} statement`,
      DATE: statementDate,
      PREV_PAGE: getPrevPage(latestCopay.station.facilityName),
      ACCOUNT_NUMBER: latestCopay?.accountNumber || selectedCopay?.pHAccountNumber,
      CHARGES: allCharges
    } 
  }

  // see about putting all these gets in the helper - gonna have diff chargest logic, maybe diff title
  const getLighthouseAttributes = (latestCopay) => {
    const latestCopay = getLatestCopay();
    const latestCopayCharges = currentCopay?.attributes?.lineItems || [];

    // loop through copays using latestCopayCharges logic to get them all
    const allCharges = latestCopayCharges;

    return {
      LATEST_COPAY: latestCopay,
      TITLE: `${statementDate} statement`,
      DATE: getLegacyStatementDate(), // change
      PREV_PAGE: getPrevPage(latestCopay.attributes.facility.name),
      ACCOUNT_NUMBER: latestCopay.attributes.accountNumber,
      CHARGES: allCharges
    }
  }

  const statementAttributes = useMemo(() => {
    if (!statementCopays?.length > 0) return DEFAULT_STATEMENT_ATTRIBUTES;
    return shouldUseLighthouseCopays ?  getLighthouseAttributes() : getLegacyAttributes();
  }, [statementCopays[0]?.id, shouldUseLighthouseCopays]);

  const formatCurrency = amount => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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
        breadcrumbList={[
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
        ]}
        label="Breadcrumb"
        wrapping
      />
      <article className="vads-u-padding--0 medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="statement-page-title">{title}</h1>
        <p className="va-introtext" data-testid="facility-name">
          {`${currentCopay?.station.facilityName}`}
        </p>
        <AccountSummary
          acctNum={acctNum}
          currentBalance={currentCopay.pHNewBalance}
          newCharges={currentCopay.pHTotCharges}
          paymentsReceived={currentCopay.pHTotCredits}
          previousBalance={currentCopay.pHPrevBal}
          statementDate={statementDate}
        />
        {shouldUseLighthouseCopays && (
          // need to make sure this can take a statment/array of copays
          <StatementTable
            charges={statementAttributes.CHARGES}
            formatCurrency={formatCurrency}
            selectedCopay={latestCopay}
          />
        )}
        <DownloadStatement
          key={statementId}
          selectedId={statementId}
          statementDate={statementAttributes.DATE}
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
