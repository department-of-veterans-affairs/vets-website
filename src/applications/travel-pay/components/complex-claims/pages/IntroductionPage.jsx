import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useLocation } from 'react-router-dom-v5-compat';

import {
  BTSSS_PORTAL_URL,
  COMPLEX_CLAIMS_ANALYTICS_NAMESPACE,
} from '../../../constants';
import {
  createComplexClaim,
  setExpenseBackDestination,
} from '../../../redux/actions';
import ComplexClaimRedirect from './ComplexClaimRedirect';
import useSetPageTitle from '../../../hooks/useSetPageTitle';
import useSetFocus from '../../../hooks/useSetFocus';
import { recordButtonClick } from '../../../util/events-helpers';
import {
  selectAppointment,
  selectComplexClaim,
} from '../../../redux/selectors';
import { stripTZOffset } from '../../../util/dates';
import { ComplexClaimsHelpSection } from '../../HelpText';

const IntroductionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: appointment } = useSelector(selectAppointment);
  const complexClaim = useSelector(selectComplexClaim);

  const title = 'File a travel reimbursement claim';

  useSetPageTitle(title);
  useSetFocus();

  const apptId = appointment?.id;

  // Only render redirect component if this is NOT from client-side navigation
  const shouldShowRedirect = !location.state?.skipRedirect;

  const createClaim = async () => {
    recordButtonClick(
      COMPLEX_CLAIMS_ANALYTICS_NAMESPACE,
      title,
      'Start your travel reimbursement claim',
    );

    if (!appointment) {
      return;
    }

    // If claim already exists, navigate directly
    const existingClaimId =
      complexClaim?.data?.claimId || appointment?.travelPayClaim?.claim?.id;

    if (existingClaimId) {
      dispatch(setExpenseBackDestination('intro'));
      navigate(`/file-new-claim/${apptId}/${existingClaimId}/choose-expense`);
      return;
    }

    try {
      const result = await dispatch(
        createComplexClaim({
          appointmentDateTime: stripTZOffset(appointment.localStartTime),
          facilityStationNumber: appointment.location.id,
          appointmentType: appointment.isCompAndPen
            ? 'CompensationAndPensionExamination'
            : 'Other',
          isComplete: false,
        }),
      );
      if (result?.claimId) {
        dispatch(setExpenseBackDestination('intro'));
        navigate(`/file-new-claim/${apptId}/${result.claimId}/choose-expense`);
      }
    } catch (error) {
      navigate(`/file-new-claim/${apptId}/create-claim-error`);
    }
  };

  return (
    <>
      {shouldShowRedirect && <ComplexClaimRedirect />}
      <div data-testid="introduction-page">
        <h1>{title}</h1>
        <div className="vads-u-margin-left--2">
          <va-process-list>
            <va-process-list-item
              header="Check your travel reimbursement eligibility"
              index="1"
            >
              <p>
                To be eligible for travel pay, you’ll need to meet all of these
                3 requirements:
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
                Travel pay covers these expenses for eligible Veterans and
                caregivers:
              </p>
              <ul>
                <li>
                  Regular transportation, such as car, bus, taxi, rideshare,
                  subway, light rail, train, or plane
                </li>
                <li>Parking and tolls from your trip</li>
                <li>Pre-approved meals and lodging expenses</li>
              </ul>
              <p>
                You’ll be asked to submit receipts when you file your claim.
              </p>
              <p>
                If your trip was one way, or if you started from somewhere other
                than your home address, you’ll need to file your claim through
                the Beneficiary Travel Self Service System (BTSSS).{' '}
              </p>
              <p>
                <va-link href={BTSSS_PORTAL_URL} external text="Go to BTSSS" />
              </p>
              <p>
                <strong>Note:</strong> We’ll save your added expenses if you
                need to leave and come back. You can review your in-progress
                claims in your travel reimbursement page.
              </p>
              {appointment &&
                !appointment.isCC && (
                  <va-link-action
                    onClick={createClaim}
                    href="#"
                    text="Start your travel reimbursement claim"
                    type="primary"
                    disable-analytics
                  />
                )}
            </va-process-list-item>
          </va-process-list>
        </div>

        <div className="vads-u-margin--2">
          <va-omb-info
            res-burden={10}
            omb-number="2900-0798"
            exp-date="11/30/2027"
          />
        </div>
        <ComplexClaimsHelpSection />
      </div>
    </>
  );
};

IntroductionPage.propTypes = {
  appointment: PropTypes.object,
};

export default IntroductionPage;
