import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { uniqBy } from 'lodash';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
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
import MCPAlerts from '../../combined/components/MCPAlerts';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';

const renderAlert = (alertType, debts) => {
  const alertInfo = alertMessage(alertType, APP_TYPES.COPAY);
  const showOther = debts > 0;
  const showVAReturnLink = !showOther && alertType !== ALERT_TYPES.ALL_ERROR;

  return (
    <va-alert data-testid={alertInfo.testID} status={alertInfo.alertStatus}>
      <h2 className="vads-u-font-size--h3" slot="headline">
        {alertInfo.header}
      </h2>
      {alertInfo.body}
      {alertInfo.secondHeader ? (
        <>
          <h3 className="vads-u-font-size--h4">{alertInfo.secondHeader}</h3>
          {alertInfo.secondBody}
        </>
      ) : null}
      {showVAReturnLink ? (
        <va-link
          active
          class="vads-u-margin-top--2"
          data-testid="return-to-va-link"
          href="https://va.gov"
          text="Return to VA.gov"
        />
      ) : null}
      {showOther && <OtherVADebts module={APP_TYPES.DEBT} subHeading />}
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
        <h2>Your other VA debts</h2>
        <va-alert data-testid={alertInfo.testID} status={alertInfo.alertStatus}>
          <h3 slot="headline" className="vads-u-font-size--h3">
            {alertInfo.header}
          </h3>
          {alertInfo.secondBody}
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

  // feature toggle stuff for VHA payment history MVP
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();
  // boolean value to represent if toggles are still loading or not
  const togglesLoading = useToggleLoadingValue();
  // value of specific toggle
  const showVHAPaymentHistory = useToggleValue(
    TOGGLE_NAMES.showVHAPaymentHistory,
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
  useHeaderPageTitle(title);

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  if (debtLoading || mcpLoading || togglesLoading) {
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
  const isNotEnrolledInHealthCare = mcpError?.status === '403';
  const renderContent = () => {
    if (isNotEnrolledInHealthCare) {
      return <MCPAlerts type="no-health-care" />;
    }
    if (mcpError) {
      return renderAlert(
        debtError ? ALERT_TYPES.ALL_ERROR : ALERT_TYPES.ERROR,
        debts?.length,
      );
    }
    if (statementsEmpty) {
      return renderAlert(ALERT_TYPES.ZERO, debts?.length);
    }

    return showVHAPaymentHistory ? (
      <article className="vads-u-padding-x--0">
        <Balances
          statements={statementsByUniqueFacility}
          showVHAPaymentHistory={showVHAPaymentHistory}
        />
        {renderOtherVA(debts?.length, debtError)}
        <div className="vads-u-margin-top--4">
          <va-need-help id="needHelp">
            <div slot="content">
              <p>
                You can contact us online through{' '}
                <va-link text="Ask VA" href="https://ask.va.gov" /> or call the
                VA Health Resource Center at{' '}
                <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} /> (
                <va-telephone contact="711" tty="true" />
                ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
              </p>
            </div>
          </va-need-help>
        </div>
      </article>
    ) : (
      <article className="vads-u-padding-x--0">
        <va-on-this-page />
        <Balances
          statements={statementsByUniqueFacility}
          showVHAPaymentHistory={showVHAPaymentHistory}
        />
        {renderOtherVA(debts?.length, debtError)}
        <HowToPay isOverview />
        <FinancialHelp />
        <DisputeCharges />
        <BalanceQuestions />
      </article>
    );
  };

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
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="summary-page-title">{title}</h1>
        <p className="va-introtext">
          Check the balance of VA health care and prescription charges from each
          of your facilities. Find out how to make payments or request financial
          help.
        </p>
        {renderContent()}
      </div>
    </>
  );
};

export default OverviewPage;
