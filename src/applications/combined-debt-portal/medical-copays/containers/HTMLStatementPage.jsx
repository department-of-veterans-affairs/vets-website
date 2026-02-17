import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  setPageFocus,
  showVHAPaymentHistory,
} from '../../combined/utils/helpers';
import Modals from '../../combined/components/Modals';
import StatementAddresses from '../components/StatementAddresses';
import AccountSummary from '../components/AccountSummary';
import StatementTable from '../components/StatementTable';
import DownloadStatement from '../components/DownloadStatement';
import NeedHelpCopay from '../components/NeedHelpCopay';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const HTMLStatementPage = ({ match }) => {
  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );

  const selectedId = match.params.id;
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  const userFullName = useSelector(({ user }) => user.profile.userFullName);

  // TODO: Refactor selectedCopay to selectedStatement and update all references in the codebase
  const [selectedCopay] = statements.filter(({ id }) => id === selectedId);

  // using statementDateOutput since it has delimiters ('/') unlike pSStatementDate
  const parsedStatementDate = new Date(selectedCopay.pSStatementDateOutput);
  const statementDate = isValid(parsedStatementDate)
    ? format(parsedStatementDate, 'MMMM d')
    : '';
  const charges = selectedCopay?.details?.filter(
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
  const prevPage = `Copay bill for ${selectedCopay.station.facilityName}`;
  const fullName = userFullName.middle
    ? `${userFullName.first} ${userFullName.middle} ${userFullName.last}`
    : `${userFullName.first} ${userFullName.last}`;
  const acctNum =
    selectedCopay?.accountNumber || selectedCopay?.pHAccountNumber;

  useHeaderPageTitle(title);

  useEffect(() => {
    setPageFocus('h1');
  }, []);

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
            href: `/manage-va-debt/summary/copay-balances/${selectedId}`,
            label: `${prevPage}`,
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${selectedId}/statement`,
            label: `${title}`,
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <article className="vads-u-padding--0 medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="statement-page-title">{title}</h1>
        <p className="va-introtext" data-testid="facility-name">
          {`${selectedCopay?.station.facilityName}`}
        </p>
        <AccountSummary
          acctNum={acctNum}
          currentBalance={selectedCopay.pHNewBalance}
          newCharges={selectedCopay.pHTotCharges}
          paymentsReceived={selectedCopay.pHTotCredits}
          previousBalance={selectedCopay.pHPrevBal}
          statementDate={statementDate}
        />
        {shouldShowVHAPaymentHistory && (
          <StatementTable
            charges={charges}
            formatCurrency={formatCurrency}
            selectedCopay={selectedCopay}
          />
        )}
        <DownloadStatement
          key={selectedId}
          statementId={selectedId}
          statementDate={selectedCopay.pSStatementDate}
          fullName={fullName}
        />
        <StatementAddresses
          data-testid="statement-addresses"
          copay={selectedCopay}
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
