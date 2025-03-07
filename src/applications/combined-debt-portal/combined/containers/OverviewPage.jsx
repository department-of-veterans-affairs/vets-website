import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import environment from '~/platform/utilities/environment';
import {
  VaButton,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import Balances from '../components/Balances';
import ComboAlerts from '../components/ComboAlerts';
import { ALERT_TYPES, setPageFocus } from '../utils/helpers';
import {
  calculateTotalDebts,
  calculateTotalBills,
} from '../utils/balance-helpers';
import { GenericDisasterAlert } from '../components/DisasterAlert';
import useHeaderPageTitle from '../hooks/useHeaderPageTitle';

const OverviewPage = () => {
  const title = 'Your VA debt and bills';
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

  // get totals
  const { debts } = debtLetters;
  const totalDebts = calculateTotalDebts(debts);
  const bills = mcp.statements;
  const totalBills = calculateTotalBills(bills);
  const bothZero =
    totalDebts === 0 && totalBills === 0 && !billError && !debtError;

  // feature toggle stuff for One VA Debt Letter flag
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();
  // boolean value to represent if toggles are still loading or not
  const togglesLoading = useToggleLoadingValue();
  // value of specific toggle
  const showOneVADebtLetterDownload = useToggleValue(
    TOGGLE_NAMES.showOneVADebtLetter,
  );

  const downloadPDF = async () => {
    // One VA Debt Letter Download url
    const pdfDownloadUrl = `${
      environment.API_URL
    }/debts_api/v0/download_one_debt_letter_pdf`;

    // let's tryy this for now
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = pdfDownloadUrl;
    downloadAnchor.download = 'CombinedStatement.pdf';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(pdfDownloadUrl);
  };

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
            label: 'Your VA debt and bills',
          },
        ]}
        label="Breadcrumb"
      />
      <br />
      <div className="medium-screen:vads-l-col--10 small-desktop-screen:vads-l-col--8">
        <h1 data-testid="overview-page-title">{title}</h1>
        <p className="va-introtext">
          Check the details of debt you might have from VA education, disability
          compensation, or pension programs, or VA health care and prescription
          charges from VA health care facilities. Find out how to make payments
          or request financial help.
        </p>
        <GenericDisasterAlert />
        {bothError || bothZero ? (
          <ComboAlerts
            alertType={bothError ? ALERT_TYPES.ERROR : ALERT_TYPES.ZERO}
          />
        ) : (
          <>
            <h2>Debt and bill overview</h2>
            <Balances />
            {showOneVADebtLetterDownload ? (
              <VaButton
                onClick={downloadPDF}
                text="View combined statement"
                secondary
              />
            ) : null}
            <h2>What to do if you have questions about your debt and bills</h2>
            <h3>Questions about benefit debt</h3>
            <p>
              Call the Debt Management Center (DMC) at{' '}
              <va-telephone contact={CONTACTS.DMC} /> (
              <va-telephone tty contact="711" />
              ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
            </p>
            <h3>Questions about medical copayment bills</h3>
            <p>
              Call the VA Health Resource Center at{' '}
              <va-telephone contact={CONTACTS.HEALTH_RESOURCE_CENTER} /> (
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
