import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom-v5-compat';

import {
  BTSSS_PORTAL_URL,
  FIND_FACILITY_TP_CONTACT_LINK,
} from '../../../constants';
import { createComplexClaim } from '../../../redux/actions';
import {
  selectAppointment,
  selectComplexClaim,
} from '../../../redux/selectors';

const IntroductionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get appointment data from the store
  const { data: appointment } = useSelector(selectAppointment);

  // Get the complex claim data from the store
  const complexClaim = useSelector(selectComplexClaim);

  const apptId = appointment?.id;

  const createClaim = async () => {
    if (!appointment) {
      return;
    }

    // If claim already exists, navigate directly
    const existingClaimId = complexClaim?.data?.claimId;
    if (existingClaimId) {
      navigate(`/file-new-claim/${apptId}/${existingClaimId}/choose-expense`);
      return;
    }

    try {
      const result = await dispatch(createComplexClaim(appointment));
      if (result?.claimId) {
        navigate(`/file-new-claim/${apptId}/${result.claimId}/choose-expense`);
      }
    } catch (error) {
      // TODO: Add proper error handling
      // Error will be handled by the Redux error state
    }
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
