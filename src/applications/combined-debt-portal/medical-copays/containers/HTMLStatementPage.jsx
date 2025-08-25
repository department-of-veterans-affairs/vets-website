import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

import { setPageFocus } from '../../combined/utils/helpers';
import Modals from '../../combined/components/Modals';
import StatementAddresses from '../components/StatementAddresses';
import AccountSummary from '../components/AccountSummary';
import StatementCharges from '../components/StatementCharges';
import DownloadStatement from '../components/DownloadStatement';
import DisputeCharges from '../components/DisputeCharges';
import HowToPay from '../components/HowToPay';
import BalanceQuestions from '../components/BalanceQuestions';
import FinancialHelp from '../components/FinancialHelp';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const HTMLStatementPage = ({ match }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const showOneThingPerPage = useToggleValue(
    TOGGLE_NAMES.showCDPOneThingPerPage,
  );

  const selectedId = match.params.id;
  const combinedPortalData = useSelector(state => state.combinedPortal);
  const statements = combinedPortalData.mcp.statements ?? [];
  const userFullName = useSelector(({ user }) => user.profile.userFullName);
  const [selectedCopay] = statements.filter(({ id }) => id === selectedId);

  // using statementDateOutput since it has delimiters ('/') unlike pSStatementDate
  const parsedStatementDate = new Date(selectedCopay.pSStatementDateOutput);
  const statementDate = isValid(parsedStatementDate)
    ? format(parsedStatementDate, 'MMMM d')
    : '';

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
            label: 'Your VA debt and bills',
          },
          {
            href: '/manage-va-debt/summary/copay-balances',
            label: 'Current copay balances',
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${selectedId}/detail`,
            label: `${prevPage}`,
          },
          {
            href: `/manage-va-debt/summary/copay-balances/${selectedId}/detail/statement`,
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
        {showOneThingPerPage ? (
          <>
            <AccountSummary
              acctNum={acctNum}
              currentBalance={selectedCopay.pHNewBalance}
              newCharges={selectedCopay.pHTotCharges}
              paymentsReceived={selectedCopay.pHTotCredits}
              previousBalance={selectedCopay.pHPrevBal}
              showOneThingPerPage={showOneThingPerPage}
              statementDate={statementDate}
            />
            <StatementCharges
              data-testid="statement-charges"
              copay={selectedCopay}
              showOneThingPerPage={showOneThingPerPage}
            />
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
            <p>
              <strong>Note:</strong> If your address has changed, call{' '}
              <va-telephone contact="8662602614" />.
            </p>
          </>
        ) : (
          <>
            <va-on-this-page />
            <AccountSummary
              currentBalance={selectedCopay.pHNewBalance}
              newCharges={selectedCopay.pHTotCharges}
              paymentsReceived={selectedCopay.pHTotCredits}
              previousBalance={selectedCopay.pHPrevBal}
              statementDate={statementDate}
              acctNum={acctNum}
            />
            <StatementCharges
              data-testid="statement-charges"
              copay={selectedCopay}
              showOneThingPerPage={showOneThingPerPage}
            />
            <div className="vads-u-margin-top--3">
              <DownloadStatement
                key={selectedId}
                statementId={selectedId}
                statementDate={selectedCopay.pSStatementDate}
                fullName={fullName}
              />
            </div>
            <StatementAddresses
              data-testid="statement-addresses"
              copay={selectedCopay}
            />
            <HowToPay acctNum={acctNum} facility={selectedCopay?.station} />
            <FinancialHelp />
            <DisputeCharges />
            <BalanceQuestions />
          </>
        )}
        <Modals title="Notice of rights and responsibilities">
          <Modals.Rights />
        </Modals>
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
