import React, { useDispatch, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  setPageFocus,
  isAnyElementFocused,
  showVHAPaymentHistory,
  useCurrentStatement,
} from '../../combined/utils/helpers';
import Modals from '../../combined/components/Modals';
import StatementAddresses from '../components/StatementAddresses';
import AccountSummary from '../components/AccountSummary';
import StatementTable from '../components/StatementTable';
import DownloadStatement from '../components/DownloadStatement';
import NeedHelpCopay from '../components/NeedHelpCopay';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';
import { current } from '@reduxjs/toolkit';
import { getCopayDetailStatement } from '../../combined/actions/copays';

const HTMLStatementPage = ({ match }) => {
  const dispatch = useDispatch();
  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );
  
  const statementId = match.params.id;
  // TODO: update all references of selectedCopay to currentStatement in the codebase
  const { currentStatement, shouldFetchStatement } = useCurrentStatement(statementId);
  
  const userFullName = useSelector(({ user }) => user.profile.userFullName);

  // using statementDateOutput since it has delimiters ('/') unlike pSStatementDate
  const parsedStatementDate = new Date(currentStatement.pSStatementDateOutput);
  const statementDate = isValid(parsedStatementDate)
    ? format(parsedStatementDate, 'MMMM d')
    : '';
  const charges = currentStatement?.details?.filter(
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
  const prevPage = `Copay bill for ${currentStatement.station.facilityName}`;
  const fullName = userFullName.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;
  const acctNum =
    currentStatement?.accountNumber || currentStatement?.pHAccountNumber;

  useHeaderPageTitle(title);

  useEffect(() => {
    if (!isAnyElementFocused()) setPageFocus();
  },[]);

  if (!currentStatement?.id || isLoading) {
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
            href: `/manage-va-debt/summary/copay-balances/${statementId}`,
            label: `${prevPage}`,
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${statementId}/statement`,
            label: `${title}`,
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <article className="vads-u-padding--0 medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="statement-page-title">{title}</h1>
        <p className="va-introtext" data-testid="facility-name">
          {`${currentStatement?.station.facilityName}`}
        </p>
        <AccountSummary
          acctNum={acctNum}
          currentBalance={currentStatement.pHNewBalance}
          newCharges={currentStatement.pHTotCharges}
          paymentsReceived={currentStatement.pHTotCredits}
          previousBalance={currentStatement.pHPrevBal}
          statementDate={statementDate}
        />
        {shouldShowVHAPaymentHistory && (
          <StatementTable
            charges={charges}
            formatCurrency={formatCurrency}
            selectedCopay={currentStatement}
          />
        )}
        <DownloadStatement
          key={statementId}
          selectedId={statementId}
          statementDate={currentStatement.pSStatementDate}
          fullName={fullName}
        />
        <StatementAddresses
          data-testid="statement-addresses"
          copay={currentStatement}
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
