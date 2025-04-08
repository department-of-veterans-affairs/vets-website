import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/web-components/react-bindings';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import * as Sentry from '@sentry/browser';
import {
  VaButton,
  VaLoadingIndicator,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import {
  selectProfile,
  selectVAPMailingAddress,
} from '~/platform/user/selectors';
import environment from 'platform/utilities/environment';
import Balances from '../components/Balances';
import ComboAlerts from '../components/ComboAlerts';
import { ALERT_TYPES, getPdfBlob, setPageFocus } from '../utils/helpers';
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

  const {
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    zipCode,
    stateCode,
  } = useSelector(selectVAPMailingAddress);
  const { userFullName = {} } = useSelector(selectProfile);

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

  const showOneVADebtLetter = useMemo(
    () => {
      // 403 error is not enrolled, so bills aren't proper borked
      const billsBorked = billError?.code !== '403' ?? false;
      return showOneVADebtLetterDownload && !debtError && !billsBorked;
    },
    [billError, debtError, showOneVADebtLetterDownload],
  );

  // give features a chance to fully load before we conditionally render
  if (togglesLoading) {
    return <VaLoadingIndicator message="Loading features..." />;
  }

  const veteranContactInformation = {
    veteranFullName: userFullName,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    zipCode,
    stateCode,
    fileNumber: debts[0]?.fileNumber || '',
  };

  // Merge into namespaced pdfData
  const pdfData = {
    copays: bills,
    debts,
    veteranContactInformation,
  };

  // some fancy PDF generation
  const handleGeneratePdf = async () => {
    try {
      const blob = await getPdfBlob('oneDebtLetter', pdfData);

      const file = new File([blob], 'one_debt_letter.pdf', {
        type: 'application/pdf',
      });

      const formData = new FormData();
      formData.append('document', file);

      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        `${environment.API_URL}/debts_api/v0/combine_one_debt_letter_pdf`,
      );
      xhr.responseType = 'blob';

      xhr.setRequestHeader('X-Key-Inflection', 'camel');
      xhr.setRequestHeader('X-CSRF-Token', localStorage.getItem('csrfToken'));
      xhr.setRequestHeader('Source-App-Name', window.appName);
      xhr.withCredentials = true;

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const filename = `one_debt_letter_${
            new Date().toISOString().split('T')[0]
          }.pdf`;

          const url = URL.createObjectURL(xhr.response);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(url);
        } else {
          Sentry.captureMessage(
            `OneDebtLetter - PDF request failed: ${xhr.status}`,
          );
        }
      };

      xhr.onerror = () => {
        Sentry.captureMessage(
          `OneDebtLetter - Network error during PDF request`,
        );
      };

      xhr.send(formData);
    } catch (err) {
      Sentry.setExtra('error: ', err);
      Sentry.captureMessage(
        `OneDebtLetter - PDF generation failed: ${err.message}`,
      );
    }
  };

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
            {/* For now, if any errors occur we're going to hide the download option */}
            {showOneVADebtLetter ? (
              <>
                <VaButton
                  onClick={handleGeneratePdf}
                  text="View combined statement"
                  className="vads-u-margin-bottom--2"
                  secondary
                />
                <va-additional-info trigger="What to know before you download">
                  <p>
                    By clicking download, you’ll download a combined PDF
                    statement view of all your benefit debt and copay bills in
                    one consolidated place.
                  </p>
                </va-additional-info>
              </>
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
