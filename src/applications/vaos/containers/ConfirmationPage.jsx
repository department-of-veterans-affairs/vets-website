import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getFormData,
  getFlowType,
  getChosenClinicInfo,
  getChosenFacilityDetails,
} from '../utils/selectors';
import {
  closeConfirmationPage,
  fetchFacilityDetails,
} from '../actions/newAppointment';
import { FLOW_TYPES, FACILITY_TYPES } from '../utils/constants';
import ConfirmationDirectScheduleInfo from '../components/ConfirmationDirectScheduleInfo';
import ConfirmationRequestInfo from '../components/ConfirmationRequestInfo';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    if (
      !this.props.facilityDetails &&
      !this.props.data.facilityType !== FACILITY_TYPES.COMMUNITY_CARE
    ) {
      this.props.fetchFacilityDetails(this.props.data.vaFacility);
    }
  }

  componentWillUnmount() {
    this.props.closeConfirmationPage();
  }
  render() {
    const { data, facilityDetails, clinic, flowType } = this.props;
    const isDirectSchedule = flowType === FLOW_TYPES.DIRECT;

    return (
      <div>
        {isDirectSchedule && (
          <ConfirmationDirectScheduleInfo
            data={data}
            facilityDetails={facilityDetails}
            clinic={clinic}
          />
        )}
        {!isDirectSchedule && (
          <ConfirmationRequestInfo
            data={data}
            facilityDetails={facilityDetails}
          />
        )}
        <div className="vads-u-margin-y--2">
          <Link to="/" className="usa-button vads-u-padding-right--2">
            View your appointments
          </Link>
          <Link to="new-appointment" className="usa-button">
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
  return {
    data: getFormData(state),
    facilityDetails: getChosenFacilityDetails(state),
    clinic: getChosenClinicInfo(state),
    flowType: getFlowType(state),
  };
}

const mapDispatchToProps = {
  closeConfirmationPage,
  fetchFacilityDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPage);
