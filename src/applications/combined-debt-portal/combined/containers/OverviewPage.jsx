import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  VaBreadcrumbs,
  VaLinkAction,
} from '@department-of-veterans-affairs/web-components/react-bindings';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';

import Balances from '../components/Balances';
import ComboAlerts from '../components/ComboAlerts';
import {
  ALERT_TYPES,
  setPageFocus,
  healthResourceCenterPhoneContent,
  dmcPhoneContent,
  showVHAPaymentHistory,
} from '../utils/helpers';
import {
  calculateTotalBills,
  calculateTotalDebts,
} from '../utils/balance-helpers';
import { GenericDisasterAlert } from '../components/DisasterAlert';
import useHeaderPageTitle from '../hooks/useHeaderPageTitle';

const OverviewPage = () => {
  const title = 'Overpayments and copay bills';
  useHeaderPageTitle(title);

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

  // feature toggle stuff for One VA Debt Letter flag
  const { useToggleValue, useToggleLoadingValue, TOGGLE_NAMES } =
    useFeatureToggle();
  // boolean value to represent if toggles are still loading or not
  const togglesLoading = useToggleLoadingValue();
  // value of specific toggle
  const showOneVADebtLetterLink = useToggleValue(
    TOGGLE_NAMES.showOneVADebtLetter,
  );
  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );

  // get totals
  const { debts } = debtLetters;
  const totalDebts = calculateTotalDebts(debts);
  const totalBills = shouldShowVHAPaymentHistory
    ? mcp.statements.meta.total
    : calculateTotalBills(mcp.statements);
  const bothZero =
    totalDebts === 0 && totalBills === 0 && !billError && !debtError;

  // give features a chance to fully load before we conditionally render
  if (togglesLoading) {
    return <VaLoadingIndicator message="Loading features..." />;
  }

  return (
    <>
      <VaBreadcrumbs
        class="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8"
        breadcrumbList={[
          {
            href: '/',
            label: 'Home',
          },
          {
            href: '/manage-va-debt/summary',
            label: 'Overpayments and copay bills',
          },
        ]}
        label="Breadcrumb"
      />
      <br />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="overview-page-title">{title}</h1>
        <p className="va-introtext">
          Check the details of benefit overpayments from VA education,
          disability compensation, and pension programs. And review VA health
          care and prescription copay charges. Find out how to make payments or
          request financial help.
        </p>
        <GenericDisasterAlert />
        {bothError || bothZero ? (
          <ComboAlerts
            alertType={bothError ? ALERT_TYPES.ERROR : ALERT_TYPES.ZERO}
          />
        ) : (
          <>
            <Balances />
            {showOneVADebtLetterLink && !debtError && !billError ? (
              <VaLinkAction
                href="/manage-va-debt/summary/combined-statements"
                label="Review combined statement"
                text="Review combined statement"
                type="secondary"
              />
            ) : null}

            <va-need-help id="needHelp" class="vads-u-margin-top--4">
              <div slot="content">
                <p>
                  <strong>Questions about overpayments</strong>
                </p>
                <p>
                  Contact us online through{' '}
                  <va-link
                    text="AskVA"
                    href="/contact-us/ask-va/introduction"
                  />{' '}
                  or call the Debt Management Center (DMC) at{' '}
                  {dmcPhoneContent()}
                </p>
                <p>
                  <strong>Questions about copay bills</strong>
                </p>
                <p>
                  Contact us online through{' '}
                  <va-link
                    text="AskVA"
                    href="/contact-us/ask-va/introduction"
                  />{' '}
                  or call the VA Health Resource Center at{' '}
                  {healthResourceCenterPhoneContent()}
                </p>
              </div>
            </va-need-help>
          </>
        )}
      </div>
    </>
  );
};

export default OverviewPage;
