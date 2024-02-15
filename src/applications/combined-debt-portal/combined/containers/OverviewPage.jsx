import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import Balances from '../components/Balances';
import ComboAlerts from '../components/ComboAlerts';
import { ALERT_TYPES, setPageFocus } from '../utils/helpers';
import {
  calculateTotalDebts,
  calculateTotalBills,
} from '../utils/balance-helpers';
import DisasterAlert from '../components/DisasterAlert';

const OverviewPage = () => {
  const title = 'Your VA debt and bills';

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  const { debtLetters, mcp } = useSelector(
    ({ combinedPortal }) => combinedPortal,
  );

  // Get errors
  const billError = mcp.error;
  const debtError = debtLetters.errors?.length > 0;
  const bothError = billError && debtError;

  // get totals
  const { debts } = debtLetters;
  const totalDebts = calculateTotalDebts(debts);
  const bills = mcp.statements;
  const totalBills = calculateTotalBills(bills);
  const bothZero =
    totalDebts === 0 && totalBills === 0 && !billError && !debtError;

  return (
    <>
      <VaBreadcrumbs
        breadcrumbList={[
          {
            href: '/',
            label: 'Home',
          },
          {
            href: '/manage-va-debt',
            label: 'Manage your VA debt',
          },
          {
            href: '/manage-va-debt/summary',
            label: 'Your VA debt and bills',
          },
        ]}
        className="vads-u-font-family--sans"
        label="Breadcrumb"
        uswds
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="overview-page-title">{title}</h1>
        <p className="va-introtext">
          Check the details of debt you might have from VA education, disability
          compensation, or pension programs, or VA health care and prescription
          charges from VA health care facilities. Find out how to make payments
          or request financial help.
        </p>
        <DisasterAlert />
        {bothError || bothZero ? (
          <ComboAlerts
            alertType={bothError ? ALERT_TYPES.ERROR : ALERT_TYPES.ZERO}
          />
        ) : (
          <>
            <h2>Debt and bill overview</h2>
            <p>
              Any payments you may have made will not be reflected here until
              our systems are updated with your next monthly statement.
            </p>
            <Balances />
            <h2>What to do if you have questions about your debt and bills</h2>
            <h3>Questions about benefit debt</h3>
            <p>
              Call the Debt Management Center (DMC) at{' '}
              <va-telephone contact="8008270648" /> (
              <va-telephone tty contact="711" />
              ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
            </p>
            <h3>Questions about medical copayment bills</h3>
            <p>
              Call the VA Health Resource Center at{' '}
              <va-telephone contact="8664001238" /> (
              <va-telephone tty contact="711" />
              ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default OverviewPage;
