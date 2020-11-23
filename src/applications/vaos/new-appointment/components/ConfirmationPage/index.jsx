import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import {
  getAppointmentLength,
  getFormData,
  getFlowType,
  getChosenClinicInfo,
  getChosenFacilityDetails,
  getSiteIdForChosenFacility,
  getChosenSlot,
} from '../../../utils/selectors';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import * as actions from '../../redux/actions';
import {
  FLOW_TYPES,
  FACILITY_TYPES,
  GA_PREFIX,
} from '../../../utils/constants';
import ConfirmationDirectScheduleInfo from './ConfirmationDirectScheduleInfo';
import ConfirmationRequestInfo from './ConfirmationRequestInfo';

export function ConfirmationPage({
  data,
  facilityDetails,
  clinic,
  flowType,
  history,
  slot,
  systemId,
  startNewAppointmentFlow,
  fetchFacilityDetails,
}) {
  const isDirectSchedule = flowType === FLOW_TYPES.DIRECT;
  const pageTitle = isDirectSchedule
    ? 'Your appointment has been scheduled'
    : 'Your appointment request has been submitted';
  useEffect(() => {
    if (history && !data?.typeOfCareId) {
      history.replace('/new-appointment');
    }

    if (
      !facilityDetails &&
      data?.vaFacility &&
      data?.facilityType !== FACILITY_TYPES.COMMUNITY_CARE
    ) {
      // Remove parse function when converting this call to FHIR service
      fetchFacilityDetails(data.vaFacility);
    }

    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <div>
      {isDirectSchedule && (
        <ConfirmationDirectScheduleInfo
          data={data}
          facilityDetails={facilityDetails}
          clinic={clinic}
          pageTitle={pageTitle}
          slot={slot}
          systemId={systemId}
        />
      )}
      {!isDirectSchedule && (
        <ConfirmationRequestInfo
          data={data}
          facilityDetails={facilityDetails}
          pageTitle={pageTitle}
        />
      )}
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
            startNewAppointmentFlow();
          }}
        >
          New appointment
        </Link>
      </div>
    </div>
  );
}

ConfirmationPage.propTypes = {
  data: PropTypes.object.isRequired,
  facilityDetails: PropTypes.object,
  clinic: PropTypes.object,
};

function mapStateToProps(state) {
  const data = getFormData(state);

  return {
    data,
    facilityDetails: getChosenFacilityDetails(state),
    clinic: getChosenClinicInfo(state),
    flowType: getFlowType(state),
    appointmentLength: getAppointmentLength(state),
    systemId: getSiteIdForChosenFacility(state),
    slot: getChosenSlot(state),
  };
}

const mapDispatchToProps = {
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
  fetchFacilityDetails: actions.fetchFacilityDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPage);
