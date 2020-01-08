import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getFormData,
  getChosenFacilityInfo,
  getFlowType,
  getChosenClinicInfo,
} from '../utils/selectors';
import { closeConfirmationPage } from '../actions/newAppointment';
import { FLOW_TYPES } from '../utils/constants';
import ConfirmationDirectScheduleInfo from '../components/ConfirmationDirectScheduleInfo';
import ConfirmationRequestInfo from '../components/ConfirmationRequestInfo';

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
  }

  componentWillUnmount() {
    this.props.closeConfirmationPage();
  }
  render() {
    const { data, facility, clinic, flowType } = this.props;
    const isDirectSchedule = flowType === FLOW_TYPES.DIRECT;

    return (
      <div>
        {isDirectSchedule && (
          <ConfirmationDirectScheduleInfo
            data={data}
            facility={facility}
            clinic={clinic}
            pageTitle={this.pageTitle}
          />
        )}
        {!isDirectSchedule && (
          <ConfirmationRequestInfo
            data={data}
            facility={facility}
            pageTitle={this.pageTitle}
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
  facility: PropTypes.object,
  clinic: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    data: getFormData(state),
    facility: getChosenFacilityInfo(state),
    clinic: getChosenClinicInfo(state),
    flowType: getFlowType(state),
  };
}

const mapDispatchToProps = {
  closeConfirmationPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPage);
