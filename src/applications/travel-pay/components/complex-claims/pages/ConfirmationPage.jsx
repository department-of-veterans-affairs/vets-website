import React from 'react';
import { useParams } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';

import { formatDateTime } from '../../../util/dates';
import {
  selectAppointment,
  selectAllExpenses,
  selectAllDocuments,
} from '../../../redux/selectors';
import { ComplexClaimsHelpSection } from '../../HelpText';
import ExpensesAccordion from './ExpensesAccordion';

const ConfirmationPage = () => {
  const { claimId } = useParams();
  const expenses = useSelector(selectAllExpenses) ?? [];
  const documents = useSelector(selectAllDocuments) ?? [];
  const appointmentData = useSelector(selectAppointment)?.data ?? null;

  const [formattedDate, formattedTime] = appointmentData?.localStartTime
    ? formatDateTime(appointmentData.localStartTime)
    : [null, null];

  return (
    <>
      <h1>We’re processing your travel reimbursement claim</h1>
      <va-alert status="success" visible>
        <h2 slot="headline">Claim submitted</h2>
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
      </va-alert>

      <h2 className="vads-u-margin-top--2">Print this confirmation page</h2>
      <p>
        If you’d like to keep a copy of the information on this page, you can
        print it now.
      </p>

      <va-button
        text="Print this page for your records"
        onClick={() => window.print()}
        class="vads-u-margin-bottom--2"
        uswds
      />

      <ExpensesAccordion expenses={expenses} documents={documents} />

      <h2 className="vads-u-margin-top--4">What happens next</h2>
      <va-process-list>
        <va-process-list-item header="VA will review your claim">
          <p>
            You can check the status of this claim or review all your travel
            claims on your travel reimbursement claims page.
          </p>
          <va-link
            href="/my-health/travel-pay/claims/"
            text="Check your travel reimbursement claim status"
          />
        </va-process-list-item>
        <va-process-list-item header="If we approve your claim, we’ll send your pay through direct deposit">
          <p>
            You must have direct deposit set up in order to receive your funds.
            Direct deposit for travel pay is different than the direct deposit
            used for other VA claims. If you’ve already set up direct deposit
            for travel pay, no additional other are needed.
          </p>
          <va-link
            href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"
            text="Set up direct deposit for travel pay"
          />
        </va-process-list-item>
      </va-process-list>
      <va-link-action
        text="Review your appointments to submit another travel reimbursement claim"
        href="/my-health/appointments/past"
      />
      <ComplexClaimsHelpSection />
    </>
  );
};

export default ConfirmationPage;
