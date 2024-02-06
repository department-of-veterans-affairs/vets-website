import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { uniqBy } from 'lodash';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  setPageFocus,
  sortStatementsByDate,
  ALERT_TYPES,
  APP_TYPES,
} from '../../combined/utils/helpers';
import Balances from '../components/Balances';
import BalanceQuestions from '../components/BalanceQuestions';
import OtherVADebts from '../../combined/components/OtherVADebts';
import alertMessage from '../../combined/utils/alert-messages';
import DisputeCharges from '../components/DisputeCharges';
import HowToPay from '../components/HowToPay';
import FinancialHelp from '../components/FinancialHelp';
import { OnThisPageOverview } from '../components/OnThisPageOverview';
import '../sass/medical-copays.scss';

const renderAlert = (alertType, debts) => {
  const alertInfo = alertMessage(alertType, APP_TYPES.COPAY);
  const showOther = debts > 0;

  return (
    <va-alert
      data-testid={alertInfo.testID}
      status={alertInfo.alertStatus}
      uswds
    >
      <h2 className="vads-u-font-size--h3" slot="headline">
        {alertInfo.header}
      </h2>
      {alertInfo.body}
      {showOther && <OtherVADebts module={APP_TYPES.DEBT} subHeading />}
      {alertType === ALERT_TYPES.ALL_ERROR && (
        <>
          <h3 className="vads-u-font-size--h4">{alertInfo.secondHeader}</h3>
          {alertInfo.secondBody}
        </>
      )}
    </va-alert>
  );
};

const renderOtherVA = (debtLength, debtError) => {
  const alertInfo = alertMessage(ALERT_TYPES.ERROR, APP_TYPES.DEBT);
  if (debtLength > 0) {
    return <OtherVADebts module={APP_TYPES.DEBT} />;
  }
  if (debtError) {
    return (
      <>
        <h3>Your other VA debts</h3>
        <va-alert
          data-testid={alertInfo.testID}
          status={alertInfo.alertStatus}
          uswds
        >
          <h4 slot="headline" className="vads-u-font-size--h3">
            {alertInfo.header}
          </h4>
          {alertInfo.body}
        </va-alert>
      </>
    );
  }
  return <></>;
};

const OverviewPage = () => {
  const { debtLetters, mcp } = useSelector(
    ({ combinedPortal }) => combinedPortal,
  );

  const {
    debts,
    isError: debtError,
    isPending: isDebtPending,
    isProfileUpdating,
  } = debtLetters;
  const debtLoading = isDebtPending || isProfileUpdating;
  const { statements, error: mcpError, pending: mcpLoading } = mcp;
  const statementsEmpty = statements?.length === 0;

  const sortedStatements = sortStatementsByDate(statements ?? []);
  const statementsByUniqueFacility = uniqBy(sortedStatements, 'pSFacilityNum');
  const title = 'Current copay balances';

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  if (debtLoading || mcpLoading) {
    return (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          set-focus
        />
      </div>
    );
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
            href: '/manage-va-debt',
            label: 'Manage your VA debt',
          },
          {
            href: '/manage-va-debt/summary',
            label: 'Your VA debt and bills',
          },
          {
            href: '/manage-va-debt/summary/copay-balances',
            label: 'Current copay balances',
          },
        ]}
        className="vads-u-font-family--sans no-wrap"
        label="Breadcrumb"
        uswds
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="overview-page-title">{title}</h1>
        <p className="vads-u-font-size--lg vads-u-font-family--sans">
          Check the balance of VA health care and prescription charges from each
          of your facilities. Find out how to make payments or request financial
          help.
        </p>
        {mcpError || statementsEmpty ? (
          <>
            {mcpError &&
              renderAlert(
                debtError ? ALERT_TYPES.ALL_ERROR : ALERT_TYPES.ERROR,
                debts?.length,
              )}

            {statementsEmpty && renderAlert(ALERT_TYPES.ZERO, debts?.length)}
          </>
        ) : (
          <>
            <OnThisPageOverview multiple={statements?.length > 1} />
            <Balances statements={statementsByUniqueFacility} />
            {renderOtherVA(debts?.length, debtError)}
            <HowToPay
              isOverview="true"
              acctNum={statementsByUniqueFacility[0].pHAccountNumber}
              facility={statementsByUniqueFacility[0].station}
            />
            <FinancialHelp />
            <DisputeCharges />
            <BalanceQuestions />
          </>
        )}
      </div>
    </>
  );
};

export default OverviewPage;
