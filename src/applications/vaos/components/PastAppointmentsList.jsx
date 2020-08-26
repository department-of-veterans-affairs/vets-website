import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import { fetchPastAppointments } from '../appointment-list/redux/actions';
import { getVAAppointmentLocationId } from '../services/appointment';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../utils/constants';
import {
  vaosPastAppts,
  selectPastAppointments,
  selectExpressCare,
} from '../utils/selectors';
import {
  getRealFacilityId,
  getPastAppointmentDateRangeOptions,
} from '../utils/appointment';
import ConfirmedAppointmentListItem from './ConfirmedAppointmentListItem';
import PastAppointmentsDateDropdown from './PastAppointmentsDateDropdown';
import { resetDataLayer } from '../utils/events';

export class PastAppointmentsList extends React.Component {
  constructor(props) {
    super(props);
    this.dateRangeOptions =
      props.dateRangeOptions || getPastAppointmentDateRangeOptions();
    this.state = { isInitialMount: true };
  }

  componentDidMount() {
    const {
      pastStatus,
      pastSelectedIndex,
      history,
      showPastAppointments,
    } = this.props;

    if (!showPastAppointments) {
      history.push('/');
    } else if (pastStatus === FETCH_STATUS.notStarted) {
      const selectedDateRange = this.dateRangeOptions[pastSelectedIndex];
      this.props.fetchPastAppointments(
        selectedDateRange.startDate,
        selectedDateRange.endDate,
        pastSelectedIndex,
      );
    }

    recordEvent({
      event: 'nav-tab-click',
      'tab-text': 'Past',
    });
    resetDataLayer();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.pastStatus === FETCH_STATUS.loading &&
      this.props.pastStatus === FETCH_STATUS.succeeded &&
      !this.state.isInitialMount
    ) {
      focusElement('#queryResultLabel');
    }
  }

  onDateRangeChange = index => {
    const selectedDateRange = this.dateRangeOptions[index];

    this.setState({ isInitialMount: false });
    this.props.fetchPastAppointments(
      selectedDateRange.startDate,
      selectedDateRange.endDate,
      index,
    );
  };

  render() {
    const {
      past,
      pastStatus,
      facilityData,
      pastSelectedIndex,
      expressCare,
    } = this.props;
    let content;

    if (pastStatus === FETCH_STATUS.loading) {
      content = (
        <div className="vads-u-margin-y--8">
          <LoadingIndicator message="Loading your appointments..." />
        </div>
      );
    } else if (pastStatus === FETCH_STATUS.succeeded && past?.length > 0) {
      content = (
        <>
          <span
            id="queryResultLabel"
            className="vads-u-font-size--sm vads-u-display--block vads-u-margin-bottom--1"
            style={{ outline: 'none' }}
          >
            Showing appointments for:{' '}
            {this.dateRangeOptions[pastSelectedIndex].label}
          </span>
          <ul className="usa-unstyled-list" id="appointments-list">
            {past.map((appt, index) => {
              switch (appt.vaos?.appointmentType) {
                case APPOINTMENT_TYPES.ccAppointment:
                case APPOINTMENT_TYPES.vaAppointment:
                  return (
                    <ConfirmedAppointmentListItem
                      key={index}
                      index={index}
                      appointment={appt}
                      facility={
                        facilityData[
                          getRealFacilityId(getVAAppointmentLocationId(appt))
                        ]
                      }
                    />
                  );
                default:
                  return null;
              }
            })}
          </ul>
        </>
      );
    } else if (pastStatus === FETCH_STATUS.failed) {
      content = (
        <AlertBox
          status="error"
          headline="We’re sorry. We’ve run into a problem"
        >
          We’re having trouble getting your past appointments. Please try again
          later.
        </AlertBox>
      );
    } else {
      content = (
        <h3 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
          You don’t have any appointments in the selected date range
        </h3>
      );
    }

    return (
      <div role="tabpanel" aria-labelledby="tabpast" id="tabpanelpast">
        {!expressCare.hasRequests && (
          <h2 tabIndex="-1" id="pastAppts" className="vads-u-font-size--h3">
            Past appointments
          </h2>
        )}
        <PastAppointmentsDateDropdown
          currentRange={pastSelectedIndex}
          onChange={this.onDateRangeChange}
          options={this.dateRangeOptions}
        />
        {content}
      </div>
    );
  }
}

PastAppointmentsList.propTypes = {
  past: PropTypes.array,
  pastStatus: PropTypes.string,
  pastSelectedIndex: PropTypes.number,
  facilityData: PropTypes.object,
  fetchPastAppointments: PropTypes.func,
  showPastAppointments: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    past: selectPastAppointments(state),
    pastStatus: state.appointments.pastStatus,
    pastSelectedIndex: state.appointments.pastSelectedIndex,
    facilityData: state.appointments.facilityData,
    fetchPastAppointments,
    showPastAppointments: vaosPastAppts(state),
    expressCare: selectExpressCare(state),
  };
}

const mapDispatchToProps = {
  fetchPastAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PastAppointmentsList);
