import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import HowDoIPay from '../components/HowDoIPay';
import NeedHelp from '../components/NeedHelp';
import DebtCardsList from '../components/DebtCardsList';
import OnThisPageLinks from '../components/OnThisPageLinks';
import '../sass/debt-letters.scss';
// TODO: OtherVA Update
import OtherVADebts from '../../../medical-copays/components/OtherVADebts';
import alertMessage from '../../combined/utils/alert-messages';
import { ALERT_TYPES, APP_TYPES } from '../../combined/utils/helpers';

const renderAlert = (alertType, statements) => {
  const alertInfo = alertMessage(alertType, APP_TYPES.DEBT);
  const showOther = statements > 0;

  return (
    <va-alert data-testid={alertInfo.testID} status={alertInfo.alertStatus}>
      <h2 className="vads-u-font-size--h3" slot="headline">
        {alertInfo.header}
      </h2>
      {alertInfo.body}
      {showOther && <OtherVADebts module={APP_TYPES.COPAY} subHeading />}
      {alertType === ALERT_TYPES.ALL_ERROR && (
        <>
          <h3 className="vads-u-font-size--h4">{alertInfo.secondHeader}</h3>
          {alertInfo.secondBody}
        </>
      )}
    </va-alert>
  );
};

const DebtLettersSummary = () => {
  const { debtLetters } = useSelector(({ combinedPortal }) => combinedPortal);
  const {
    isProfileUpdating,
    isPending,
    isPendingVBMS,
    isError,
    isVBMSError,
    debts,
    debtLinks,
  } = debtLetters;

  const { statements: mcpStatements, error: mcpError } = useSelector(
    ({ combinedPortal }) => combinedPortal.mcp,
  );

  useEffect(() => {
    scrollToTop();
  }, []);

  if (isPending || isPendingVBMS || isProfileUpdating) {
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

  const allDebtsFetchFailure = isVBMSError && isError;
  const allDebtsEmpty =
    !allDebtsFetchFailure && debts.length === 0 && debtLinks.length === 0;

  return (
    <div className="vads-l-grid-container vads-u-padding-x--0">
      <va-breadcrumbs
        className="vads-l-col--12 vads-u-padding-x--0"
        label="Breadcrumb"
      >
        <a href="/">Home</a>
        <a href="/manage-debt-and-bills/">Manage your VA debt and bills</a>
        <a href="/manage-debt-and-bills/summary/">
          Your debt and bills summary
        </a>
        <Link to="/debt-balances">Benefit debt balances</Link>
      </va-breadcrumbs>

      <section
        className="vads-l-row vads-u-margin-x--neg2p5"
        data-testid="current-va-debt"
      >
        <h1
          data-testid="summary-page-title"
          className="vads-u-margin-bottom--2"
        >
          Current VA debt
        </h1>

        <div className="vads-u-display--block">
          <div className="vads-l-col--12">
            <p className="va-introtext vads-u-margin-top--0 vads-u-margin-bottom--2">
              Check the details of VA debt you might have related to your
              education, disability compensation, or pension benefits. Find out
              how to pay your debt and what to do if you need financial
              assistance.
            </p>
            <>
              {allDebtsFetchFailure &&
                renderAlert(
                  mcpError ? ALERT_TYPES.ALL_ERROR : ALERT_TYPES.ERROR,
                  mcpStatements?.length,
                )}

              {allDebtsEmpty &&
                renderAlert(ALERT_TYPES.ZERO, mcpStatements?.length)}

              {!allDebtsFetchFailure && (
                <>
                  <OnThisPageLinks />

                  <DebtCardsList />

                  <HowDoIPay />

                  <NeedHelp />
                </>
              )}
            </>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DebtLettersSummary;
