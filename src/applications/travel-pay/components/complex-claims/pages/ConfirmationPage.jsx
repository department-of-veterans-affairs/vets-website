import React from 'react';
import { useParams } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';

import { formatDateTime } from '../../../util/dates';
import {
  selectAppointment,
  selectAllExpenses,
  selectAllDocuments,
  selectComplexClaimSubmissionState,
} from '../../../redux/selectors';
import { ComplexClaimsHelpSection } from '../../HelpText';
import ExpensesAccordion from './ExpensesAccordion';
import {
  TRAVEL_PAY_INFO_LINK,
  BTSSS_PORTAL_URL,
  FORM_103542_LINK,
} from '../../../constants';

const ConfirmationPage = () => {
  const { claimId } = useParams();
  const expenses = useSelector(selectAllExpenses) ?? [];
  const documents = useSelector(selectAllDocuments) ?? [];
  const appointmentData = useSelector(selectAppointment)?.data ?? null;
  const submissionState = useSelector(selectComplexClaimSubmissionState);

  const { isSubmitting, error: submitError, data: submitResponse } =
    submissionState || {};
  let pageHeader;
  let alertConfig = { status: null, headline: '' }; // default

  if (submitError) {
    pageHeader = 'We couldn’t file your claim';
    alertConfig = {
      status: 'error',
      headline: 'Something went wrong on our end',
    };
  } else if (submitResponse) {
    pageHeader = 'We’re processing your travel reimbursement claim';
    alertConfig = {
      status: 'success',
      headline: 'Claim submitted',
    };
  }

  const [formattedDate, formattedTime] = appointmentData?.localStartTime
    ? formatDateTime(appointmentData.localStartTime)
    : [null, null];

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
              <ExpensesAccordion expenses={expenses} documents={documents} />
            </>
          )}
          <h2 className="vads-u-margin-top--4">What happens next</h2>
          {submitError ? (
            <div>
              <p>
                You can still file a claim within 30 days of this appointment
                these other ways:
              </p>
              <ul>
                <li>
                  <p className="vads-u-margin-y--2">
                    Online 24/7 through the Beneficiary Travel Self Service
                    System (BTSSS)
                  </p>
                  <va-link
                    external
                    href={BTSSS_PORTAL_URL}
                    text="File a travel claim online"
                  />
                </li>
                <li>
                  <p className="vads-u-margin-y--2">
                    VA Form 10-3542 by mail, fax, email, or in person
                  </p>
                  <va-link
                    href={FORM_103542_LINK}
                    text="Learn more about VA Form 10-3542"
                  />
                </li>
              </ul>
            </div>
          ) : (
            <>
              <va-process-list>
                <va-process-list-item header="VA will review your claim">
                  <p>
                    You can check the status of this claim or review all your
                    travel claims on your travel reimbursement claims page.
                  </p>
                  <va-link
                    href="/my-health/travel-pay/claims/"
                    text="Check your travel reimbursement claim status"
                  />
                </va-process-list-item>
                <va-process-list-item header="If we approve your claim, we’ll send your pay through direct deposit">
                  <p>
                    You must have direct deposit set up in order to receive your
                    funds. Direct deposit for travel pay is different than the
                    direct deposit used for other VA claims. If you’ve already
                    set up direct deposit for travel pay, no additional other
                    are needed.
                  </p>
                  <va-link
                    href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"
                    text="Set up direct deposit for travel pay"
                  />
                </va-process-list-item>
              </va-process-list>
            </>
          )}
          {!submitError && (
            <div className="vads-u-margin-top--2">
              <va-link-action
                text="Review your appointments to submit another travel reimbursement claim"
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
