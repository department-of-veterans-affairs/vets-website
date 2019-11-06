import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getFormData,
  getChosenFacilityInfo,
  getChosenClinicInfo,
  getChosenVACityState,
} from '../utils/selectors';
import ConfirmationDirectScheduleInfo from '../components/ConfirmationDirectScheduleInfo';
import ConfirmationRequestInfo from '../components/ConfirmationRequestInfo';

export class ConfirmationPage extends React.Component {
  render() {
    const { data, facility, clinic, vaCityState } = this.props;

    return (
      <div>
        {data.isDirectSchedule && (
          <ConfirmationDirectScheduleInfo
            data={data}
            facility={facility}
            clinic={clinic}
          />
        )}
        {!data.isDirectSchedule && (
          <ConfirmationRequestInfo
            data={data}
            facility={facility}
            vaCityState={vaCityState}
          />
        )}
        <div className="vads-u-margin-y--2">
          <Link to="appointments" className="usa-button vads-u-padding-right--2">
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
  facility: PropTypes.object,
  clinic: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    data: getFormData(state),
    facility: getChosenFacilityInfo(state),
    clinic: getChosenClinicInfo(state),
    vaCityState: getChosenVACityState(state),
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
