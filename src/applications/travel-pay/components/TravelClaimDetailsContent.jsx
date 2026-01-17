import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import { ComplexClaimsHelpSection } from './HelpText';
import ClaimDetailsContent from './ClaimDetailsContent';
import {
  getClaimDetails,
  getAppointmentDataByDateTime,
} from '../redux/actions';
import { TRAVEL_PAY_INFO_LINK, REIMBURSEMENT_URL } from '../constants';

export default function TravelClaimDetailsContent() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const complexClaimsEnabled = useToggleValue(
    TOGGLE_NAMES.travelPayEnableComplexClaims,
  );

  const { data, error } = useSelector(state => state.travelPay.claimDetails);
  const {
    data: appointmentData,
    isLoading: appointmentLoading,
    error: appointmentError,
  } = useSelector(state => state.travelPay.appointment);

  const claimData = data[id];
  const appointmentDateTime = claimData?.appointment?.appointmentDateTime;

  useEffect(
    () => {
      if (id && !data[id] && !error) {
        dispatch(getClaimDetails(id));
      }
    },
    [dispatch, data, error, id],
  );

  useEffect(
    () => {
      if (
        complexClaimsEnabled &&
        !appointmentData &&
        appointmentDateTime &&
        !appointmentLoading &&
        !appointmentError
      ) {
        dispatch(getAppointmentDataByDateTime(appointmentDateTime));
      }
    },
    [
      dispatch,
      complexClaimsEnabled,
      appointmentData,
      appointmentDateTime,
      appointmentLoading,
      appointmentError,
    ],
  );

  return (
    <>
      {error && (
        <>
          <h1>Your travel reimbursement claim</h1>
          <va-alert
            close-btn-aria-label="Close notification"
            status="error"
            visible
          >
            <h2 slot="headline">Something went wrong on our end</h2>
            <p className="vads-u-margin-y--0">
              We’re sorry. We couldn’t get your travel reimbursement claim
              status in this tool right now. Please try again later.
            </p>
            <p>
              You can call the BTSSS call center at{' '}
              <va-telephone contact="8555747292" /> (
              <va-telephone tty contact="711" />) Monday through Friday, 8:00
              a.m. to 8:00 p.m. ET.
            </p>
            <va-link
              href={TRAVEL_PAY_INFO_LINK}
              text="Find out how to file for travel reimbursement"
            />
          </va-alert>
        </>
      )}
      {data[id] && <ClaimDetailsContent {...data[id]} />}
      <hr className="vads-u-margin-bottom--0" />

      <div className="vads-u-margin-bottom--4">
        <p>
          <strong>Note:</strong> Even if you already set up direct deposit for
          your VA benefits, you’ll need to set up another direct deposit for VA
          travel pay. If you’re eligible for reimbursement, we’ll deposit your
          funds in your bank account.
        </p>
        <va-link
          href={REIMBURSEMENT_URL}
          text="Learn how to set up direct deposit for travel pay"
        />
        <ComplexClaimsHelpSection className="vads-u-margin-left--0" />
      </div>
    </>
  );
}
