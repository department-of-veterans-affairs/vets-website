import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import {
  setPageFocus,
  ALERT_TYPES,
  APP_TYPES,
  debtLettersShowLettersVBMS,
} from '../../combined/utils/helpers';
import DebtCardsList from '../components/DebtCardsList';
// TODO: OtherVA Update
import OtherVADebts from '../../combined/components/OtherVADebts';
import alertMessage from '../../combined/utils/alert-messages';
import useHeaderPageTitle from '../../combined/hooks/useHeaderPageTitle';
import ZeroDebtsCopaysSection from '../../combined/components/ZeroDebtsCopaysSection';
import NeedHelp from '../components/NeedHelp';

const renderAlert = (alertType, statements) => {
  const alertInfo = alertMessage(alertType, APP_TYPES.DEBT);
  const showOther = statements > 0;
  const showVAReturnLink = !showOther && alertType !== ALERT_TYPES.ALL_ERROR;

  return alertType === ALERT_TYPES.ALL_ZERO ? (
    <ZeroDebtsCopaysSection />
  ) : (
    <va-alert data-testid={alertInfo.testID} status={alertInfo.alertStatus}>
      <h2 className="vads-u-font-size--h3" slot="headline">
        {alertInfo.header}
      </h2>
      {alertInfo.body}
      {alertInfo.secondHeader ? (
        <h3 className="vads-u-font-size--h4">{alertInfo.secondHeader}</h3>
      ) : null}
      {alertInfo.secondBody ? alertInfo.secondBody : null}
      {showVAReturnLink ? (
        <va-link
          active
          class="vads-u-margin-top--2"
          data-testid="return-to-va-link"
          href="https://va.gov"
          text="Return to VA.gov"
        />
      ) : null}
      {showOther && <OtherVADebts module={APP_TYPES.COPAY} subHeading />}
    </va-alert>
  );
};

const renderOtherVA = (mcpLength, mcpError) => {
  const alertInfo = alertMessage(ALERT_TYPES.ERROR, APP_TYPES.COPAY);
  if (mcpLength) {
    return <OtherVADebts module={APP_TYPES.COPAY} />;
  }
  if (mcpError) {
    return (
      <>
        <h2>VA copay bills</h2>
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

const DebtLettersSummary = () => {
  const { debtLetters, mcp } = useSelector(
    ({ combinedPortal }) => combinedPortal,
  );
  const showDebtLetterDownload = useSelector(state =>
    debtLettersShowLettersVBMS(state),
  );

  const {
    debts,
    debtLinks,
    isError: debtError,
    isPending: isDebtPending,
    isPendingVBMS,
    isProfileUpdating,
  } = debtLetters;
  const { statements: mcpStatements, error: mcpError } = mcp;
  const allDebtsEmpty =
    !debtError && debts.length === 0 && debtLinks.length === 0;
  const title = 'Overpayment balances';
  useHeaderPageTitle(title);

  useEffect(() => {
    setPageFocus('h1');
  }, []);

  if (isDebtPending || isPendingVBMS || isProfileUpdating) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Please wait while we load the application for you."
      />
    );
  }

  const renderContent = () => {
    if (debtError) {
      return renderAlert(
        mcpError ? ALERT_TYPES.ALL_ERROR : ALERT_TYPES.ERROR,
        mcpStatements?.length,
      );
    }

    if (allDebtsEmpty) {
      return renderAlert(ALERT_TYPES.ZERO, mcpStatements?.length);
    }

    return (
      <article className="vads-u-padding-x--0">
        <DebtCardsList />
        {renderOtherVA(mcpStatements?.length, mcpError)}
        {showDebtLetterDownload ? (
          <section>
            <h2
              id="downloadDebtLetters"
              className="vads-u-margin-top--4 vads-u-font-size--h2"
            >
              Download debt letters
            </h2>
            <p className="vads-u-margin-bottom--0 vads-u-font-family--sans">
              You can download some of your letters for education, compensation
              and pension debt.
            </p>

            <Link
              to="/debt-balances/letters"
              className="vads-u-margin-top--1 vads-u-font-family--sans"
              data-testid="download-letters-link"
            >
              Download letters related to your VA debt
            </Link>
          </section>
        ) : null}
        <NeedHelp />
      </article>
    );
  };

  // Render common header content
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
            href: '/manage-va-debt/summary/debt-balances',
            label: 'Overpayment balances',
          },
        ]}
        label="Breadcrumb"
        wrapping
      />
      <div
        className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8"
        data-testid="current-va-debt"
      >
        <h1
          data-testid="summary-page-title"
          className="vads-u-margin-bottom--2"
        >
          {title}
        </h1>
        <p className="va-introtext">
          Check the details of benefit overpayments you might have from VA
          education, disability compensation, or pension programs. Find out how
          to resolve overpayments and what to do if you need financial
          assistance.
        </p>
        {renderContent()}
      </div>
    </>
  );
};

export default DebtLettersSummary;
