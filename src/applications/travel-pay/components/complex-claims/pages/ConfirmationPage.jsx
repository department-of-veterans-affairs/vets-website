import React from 'react';
import { useParams } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import useSetFocus from '../../../hooks/useSetFocus';
import useRecordPageview from '../../../hooks/useRecordPageview';
import { formatDateTime } from '../../../util/dates';
import {
  selectAppointment,
  selectAllExpenses,
  selectAllDocuments,
  selectComplexClaimSubmissionState,
} from '../../../redux/selectors';
import { ComplexClaimsHelpSection } from '../../HelpText';
import ExpensesAccordion from './ExpensesAccordion';
import { TRAVEL_PAY_INFO_LINK } from '../../../constants';
import WhatHappensNextSection from './WhatHappensNextSection';

const ConfirmationPage = () => {
  const { claimId } = useParams();
  const expenses = useSelector(selectAllExpenses) ?? [];
  const documents = useSelector(selectAllDocuments) ?? [];
  const appointmentData = useSelector(selectAppointment)?.data ?? null;
  const submissionState = useSelector(selectComplexClaimSubmissionState);

  const { isSubmitting, error: submitError, data: submitResponse } =
    submissionState || {};
  let pageHeader = 'We’re processing your travel reimbursement claim';
  let alertConfig = { status: null, headline: '' }; // default

  if (submitError) {
    // override header if there is an error
    pageHeader = 'We couldn’t file your claim';
    alertConfig = {
      status: 'error',
      headline: 'Something went wrong on our end',
    };
  } else if (submitResponse) {
    alertConfig = {
      status: 'success',
      headline: 'Claim submitted',
    };
  }

  const [formattedDate, formattedTime] = appointmentData?.localStartTime
    ? formatDateTime(appointmentData.localStartTime)
    : [null, null];

  useSetPageTitle(pageHeader);
  useSetFocus();
  useRecordPageview('complex-claims', pageHeader);

  return (
    <>
      <h1>{pageHeader}</h1>
      {isSubmitting ? (
        <va-loading-indicator
          label="Loading confirmation page"
          message="Please wait while we load the confirmation page for you."
          data-testid="travel-pay-confirmation-loading-indicator"
        />
      ) : (
        <>
          {alertConfig.status && (
            <va-alert status={alertConfig.status} visible>
              <h2 slot="headline">{alertConfig.headline}</h2>
              {/* ✅ SUCCESS */}
              {alertConfig.status === 'success' && (
                <>
                  <p className="vads-u-margin-y--0">Claim number: {claimId}</p>

                  {appointmentData && (
                    <p className="vads-u-margin-bottom--0">
                      This claim is for your appointment
                      {appointmentData.location?.attributes?.name
                        ? ` at ${appointmentData.location.attributes.name}`
                        : ''}
                      {appointmentData.practitionerName
                        ? ` with ${appointmentData.practitionerName}`
                        : ''}
                      {formattedDate && formattedTime
                        ? ` on ${formattedDate} at ${formattedTime}`
                        : ''}
                      .
                    </p>
                  )}
                </>
              )}
              {/* ❌ ERROR */}
              {alertConfig.status === 'error' && (
                <div>
                  <p>
                    We’re sorry. We couldn’t file your travel reimbursement
                    claim in this tool right now. Please try again later.
                  </p>
                  <p>
                    Or you can still file within 30 days of the appointment
                    through the Beneficiary Travel Self Service System (BTSSS).
                  </p>
                  <va-link
                    href={TRAVEL_PAY_INFO_LINK}
                    text="Find out how to file for travel reimbursement"
                  />
                </div>
              )}
            </va-alert>
          )}
          {!submitError && (
            <>
              <h2 className="vads-u-margin-top--2">
                Print this confirmation page
              </h2>
              <p>
                If you’d like to keep a copy of the information on this page,
                you can print it now.
              </p>

              <va-button
                text="Print this page for your records"
                onClick={() => window.print()}
                class="vads-u-margin-bottom--2"
                uswds
              />
              <ExpensesAccordion
                expenses={expenses}
                documents={documents}
                headerLevel={2}
              />
            </>
          )}
          <WhatHappensNextSection isError={!!submitError} />
          {!submitError && (
            <div className="vads-u-margin-top--2">
              <va-link-action
                text="Go to your past appointments to file another claim"
                href="/my-health/appointments/past"
              />
            </div>
          )}
          <ComplexClaimsHelpSection />
        </>
      )}
    </>
  );
};

export default ConfirmationPage;
