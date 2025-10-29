import React from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom-v5-compat';

import {
  BTSSS_PORTAL_URL,
  FIND_FACILITY_TP_CONTACT_LINK,
} from '../../../constants';

const IntroductionPage = ({ appointment }) => {
  // For now, we will override the appointment
  // TODO Remove this override when appointment data is wired up in redux store
  const overriddenAppointment = appointment || {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    appointmentSource: 'API',
    appointmentDateTime: '2025-10-17T21:32:16.531Z',
    appointmentName: 'string',
    appointmentType: 'EnvironmentalHealth',
    facilityId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    facilityName: 'Cheyenne VA Medical Center',
    serviceConnectedDisability: 0,
    currentStatus: 'Pending',
    appointmentStatus: 'Complete',
    externalAppointmentId: '12345',
    associatedClaimId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    associatedClaimNumber: '',
    isCompleted: true,
  };
  const navigate = useNavigate();
  const apptId = overriddenAppointment.id;
  const createClaim = () => {
    navigate(`/file-new-claim/complex/${apptId}/choose-expense`);
    // TODO Add logic to add a claim here
  };

  return (
    <div data-testid="introduction-page">
      <h1>File a travel reimbursement claim</h1>
      <div className="vads-u-margin-left--2">
        <va-process-list>
          <va-process-list-item
            header="Check your travel reimbursement eligibility"
            index="1"
          >
            <p>
              To be eligible for travel reimbursement, you’ll need to meet all 3
              of these requirements:
            </p>
            <ul>
              <li>
                You’re eligible for health care travel reimbursement,{' '}
                <strong>and</strong>
              </li>
              <li>
                Your travel reimbursement direct deposit is set up,{' '}
                <strong>and</strong>
              </li>
              <li>Your appointment happened no more than 30 days ago</li>
            </ul>
            <va-link
              href="/health-care/get-reimbursed-for-travel-pay/#eligibility-for-general-health"
              text="Learn more about travel reimbursement eligibility"
            />
          </va-process-list-item>
          <va-process-list-item header="Set up direct deposit" index="2">
            <p>
              Direct deposit for travel reimbursement is different than direct
              deposit used for other VA claims. Before you start your travel
              reimbursement claim, you’ll need to set up direct deposit. If
              you’ve already done this, you can go to step 3.
            </p>
            <va-link
              href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"
              text="Set up direct deposit for travel reimbursement"
            />
          </va-process-list-item>
          <va-process-list-item header="File your claim" index="3">
            <p>
              General health care travel reimbursement covers these expenses for
              eligible Veterans and caregivers:
            </p>
            <ul>
              <li>
                Regular transportation, such as car, bus, taxi, rideshare,
                subway, light rail, train, or plane
              </li>
              <li>Parking and tolls from your trip</li>
              <li>Pre-approved meals and lodging expenses</li>
            </ul>
            <p>You’ll be asked to submit receipts when you file your claim.</p>
            <p>
              <strong>Note:</strong> If you’re applying for a one-way trip, or
              if you started from an address other than the one we have on file,
              you’ll need to use the{' '}
              <va-link
                href={BTSSS_PORTAL_URL}
                text="Beneficiary Travel Self Service System (BTSSS)"
              />{' '}
              to file your claim.
            </p>
            <va-link-action
              onClick={createClaim}
              href="javascript0:void"
              text="Start your travel reimbursement claim"
              type="primary"
            />
          </va-process-list-item>
        </va-process-list>
      </div>

      <div className="vads-u-margin--2">
        <va-omb-info
          res-burden={15}
          omb-number="2900-0798"
          exp-date="11/30/2027"
        />
      </div>
      <div className="complex-claim-help-section vads-u-margin--2">
        <h2 className="complex-claim-help-heading">Need help?</h2>
        <p className="vads-u-margin-top--0">
          You can call the BTSSS call center at{' '}
          <va-telephone contact="8555747292" /> (
          <va-telephone tty contact="711" />) We’re here Monday through Friday,
          8:00 a.m. to 8:00 p.m. ET. Have your claim number ready to share when
          you call.
        </p>
        <p>Or call your VA health facility’s Beneficiary Travel contact.</p>
        <va-link
          href={FIND_FACILITY_TP_CONTACT_LINK}
          text="Find the travel contact for your facility"
        />
      </div>
    </div>
  );
};

IntroductionPage.propTypes = {
  appointment: PropTypes.object,
};

export default IntroductionPage;
