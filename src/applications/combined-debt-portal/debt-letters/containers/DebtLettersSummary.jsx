import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
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

const renderAlert = (alertType, statements) => {
  const alertInfo = alertMessage(alertType, APP_TYPES.DEBT);
  const showOther = statements > 0;
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
        <h2>Your VA copay bills</h2>
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
  const title = 'Current debts';
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
        <va-need-help id="needHelp" class="vads-u-margin-top--4">
          <div slot="content">
            <p>
              If you have any questions about your benefit overpayment or if you
              think your debt was created in an error, you can dispute it.
              Contact us online through <a href="https://ask.va.gov/">Ask VA</a>{' '}
              or call the Debt Management Center at{' '}
              <va-telephone contact={CONTACTS.DMC} /> (
              <va-telephone contact="711" tty="true" />
              ). For international callers, use{' '}
              <va-telephone contact={CONTACTS.DMC_OVERSEAS} international />.
              We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
            </p>
          </div>
        </va-need-help>
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
            label: 'Your VA debt and bills',
          },
          {
            href: '/manage-va-debt/summary/debt-balances',
            label: 'Current debts',
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
          Check the details of debt you might have from VA education, disability
          compensation, or pension programs. Find out how to pay your debt and
          what to do if you need financial assistance.
        </p>
        <p>
          Please note that payments may take up to 4 business days to reflect
          after processing.
        </p>
        {renderContent()}
      </div>
    </>
  );
};

export default DebtLettersSummary;
