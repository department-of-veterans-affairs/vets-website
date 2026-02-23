import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  setPageFocus,
  isAnyElementFocused
} from '../../combined/utils/helpers';
import {
  showCopayPaymentHistory,
  useCurrentCopay,
} from '../../combined/utils/selectors';
import Modals from '../../combined/components/Modals';
import StatementAddresses from '../components/StatementAddresses';
import AccountSummary from '../components/AccountSummary';
import StatementTable from '../components/StatementTable';
import DownloadStatement from '../components/DownloadStatement';
import NeedHelpCopay from '../components/NeedHelpCopay';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const HTMLStatementPage = () => {
  const shouldShowCopayPaymentHistory = showCopayPaymentHistory(
    useSelector(state => state),
  );
  
  const { id: copayId } = useParams();
  const { currentCopay, isLoading } = useCurrentCopay();

  const userFullName = useSelector(({ user }) => user.profile.userFullName);

  // using statementDateOutput since it has delimiters ('/') unlike pSStatementDate
  const parsedStatementDate = new Date(currentCopay.pSStatementDateOutput);
  const statementDate = isValid(parsedStatementDate)
    ? format(parsedStatementDate, 'MMMM d')
    : '';

  const charges = currentCopay?.details?.filter(
    charge => !charge.pDTransDescOutput.startsWith('&nbsp;'),
  );

  const formatCurrency = amount => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  const title = `${statementDate} statement`;
  const prevPage = `Copay bill for ${currentCopay.station.facilityName}`;
  const fullName = userFullName.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;
  const acctNum =
    currentCopay?.accountNumber || currentCopay?.pHAccountNumber;

  useHeaderPageTitle(title);

  useEffect(() => {
    if (!isAnyElementFocused()) setPageFocus();
  },[]);

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
            href: `/manage-va-debt/summary/copay-balances/${copayId}`,
            label: `${prevPage}`,
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${copayId}/statement`,
            label: `${title}`,
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
        {shouldShowCopayPaymentHistory && (
          <StatementTable
            charges={charges}
            formatCurrency={formatCurrency}
            selectedCopay={currentCopay}
          />
        )}
        <DownloadStatement
          key={copayId}
          selectedId={copayId}
          statementDate={currentCopay.pSStatementDate}
          fullName={fullName}
        />
        <StatementAddresses
          data-testid="statement-addresses"
          copay={currentCopay}
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
