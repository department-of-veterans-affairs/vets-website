import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { selectFeatureHomepageRefresh } from '../../../redux/selectors';
import { selectConfirmationPage } from '../../redux/selectors';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import {
  startNewAppointmentFlow,
  fetchFacilityDetails,
} from '../../redux/actions';
import {
  FLOW_TYPES,
  FACILITY_TYPES,
  GA_PREFIX,
  FETCH_STATUS,
} from '../../../utils/constants';
import ConfirmationDirectScheduleInfo from './ConfirmationDirectScheduleInfo';
import ConfirmationDirectScheduleInfoV2 from './ConfirmationDirectScheduleInfoV2';
import ConfirmationRequestInfo from './ConfirmationRequestInfo';

export default function ConfirmationPage() {
  const dispatch = useDispatch();
  const featureHomepageRefresh = useSelector(selectFeatureHomepageRefresh);
  const {
    data,
    facilityDetails,
    clinic,
    flowType,
    slot,
    hasResidentialAddress,
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
    return <Redirect to="/new-appointment" />;
  }

  return (
    <div>
      {isDirectSchedule &&
        (featureHomepageRefresh ? (
          <ConfirmationDirectScheduleInfoV2
            data={data}
            facilityDetails={facilityDetails}
            clinic={clinic}
            slot={slot}
          />
        ) : (
          <ConfirmationDirectScheduleInfo
            clinic={clinic}
            data={data}
            facilityDetails={facilityDetails}
            pageTitle={pageTitle}
            slot={slot}
          />
        ))}
      {!isDirectSchedule && (
        <ConfirmationRequestInfo
          data={data}
          facilityDetails={facilityDetails}
          pageTitle={pageTitle}
          hasResidentialAddress={hasResidentialAddress}
        />
      )}
      {!featureHomepageRefresh && (
        <div className="vads-u-margin-y--2">
          <Link
            to="/"
            className="usa-button vads-u-padding-right--2"
            onClick={() => {
              recordEvent({
                event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
              });
            }}
          >
            View your appointments
          </Link>
          <Link
            to="new-appointment"
            className="usa-button"
            onClick={() => {
              recordEvent({
                event: `${GA_PREFIX}-schedule-another-appointment-button-clicked`,
              });
              dispatch(startNewAppointmentFlow());
            }}
          >
            New appointment
          </Link>
        </div>
      )}
    </div>
  );
}
