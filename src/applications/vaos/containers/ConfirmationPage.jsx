import React from 'react';
import { Link } from 'react-router';
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
} from '../utils/selectors';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import {
  startNewAppointmentFlow,
  fetchFacilityDetails,
} from '../actions/newAppointment';
import { FLOW_TYPES, FACILITY_TYPES, GA_PREFIX } from '../utils/constants';
import ConfirmationDirectScheduleInfo from '../components/ConfirmationDirectScheduleInfo';
import ConfirmationRequestInfo from '../components/ConfirmationRequestInfo';

// Only use this when we need to pass data that comes back from one of our
// services files to one of the older api functions
function parseFakeFHIRId(id) {
  return id.replace('var', '');
}

export class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    let pageTitle;
    if (this.props.flowType === FLOW_TYPES.DIRECT) {
      pageTitle = 'Your appointment has been scheduled';
    } else {
      pageTitle = 'Your appointment request has been submitted';
    }

    this.pageTitle = pageTitle;
  }

  componentDidMount() {
    document.title = `${this.pageTitle} | Veterans Affairs`;

    const { data, router } = this.props;
    // Check formData for typeOfCareId. Reroute if empty
    if (router && !data?.typeOfCareId) {
      router.replace('/new-appointment');
    }

    if (
      !this.props.facilityDetails &&
      data.vaFacility &&
      data.facilityType !== FACILITY_TYPES.COMMUNITY_CARE
    ) {
      // Remove parse function when converting this call to FHIR service
      this.props.fetchFacilityDetails(parseFakeFHIRId(data.vaFacility));
    }
    scrollAndFocus();
  }

  render() {
    const {
      data,
      facilityDetails,
      clinic,
      flowType,
      slot,
      systemId,
    } = this.props;
    const isDirectSchedule = flowType === FLOW_TYPES.DIRECT;

    return (
      <div>
        {isDirectSchedule && (
          <ConfirmationDirectScheduleInfo
            data={data}
            facilityDetails={facilityDetails}
            clinic={clinic}
            pageTitle={this.pageTitle}
            slot={slot}
            systemId={systemId}
          />
        )}
        {!isDirectSchedule && (
          <ConfirmationRequestInfo
            data={data}
            facilityDetails={facilityDetails}
            pageTitle={this.pageTitle}
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
              this.props.startNewAppointmentFlow();
            }}
          >
            New appointment
          </Link>
        </div>
      </div>
    );
  }
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
  startNewAppointmentFlow,
  fetchFacilityDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPage);
