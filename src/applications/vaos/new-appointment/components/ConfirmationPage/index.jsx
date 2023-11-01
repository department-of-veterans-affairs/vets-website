import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { selectConfirmationPage } from '../../redux/selectors';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import { fetchFacilityDetails } from '../../redux/actions';
import {
  FLOW_TYPES,
  FACILITY_TYPES,
  FETCH_STATUS,
} from '../../../utils/constants';
import ConfirmationDirectScheduleInfoV2 from './ConfirmationDirectScheduleInfoV2';

export default function ConfirmationPage() {
  const dispatch = useDispatch();
  const {
    data,
    facilityDetails,
    clinic,
    flowType,
    slot,
    submitStatus,
  } = useSelector(selectConfirmationPage, shallowEqual);

  const isDirectSchedule = flowType === FLOW_TYPES.DIRECT;
  const pageTitle = isDirectSchedule
    ? 'Your appointment has been scheduled'
    : 'Your appointment request has been submitted';
  useEffect(() => {
    if (
      !facilityDetails &&
      data?.vaFacility &&
      data?.facilityType !== FACILITY_TYPES.COMMUNITY_CARE
    ) {
      dispatch(fetchFacilityDetails(data.vaFacility));
    }

    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  if (submitStatus !== FETCH_STATUS.succeeded) {
    return <Redirect to="/my-health/appointments/schedule/type-of-care" />;
  }

  return (
    <div>
      <ConfirmationDirectScheduleInfoV2
        data={data}
        facilityDetails={facilityDetails}
        clinic={clinic}
        slot={slot}
      />
    </div>
  );
}
