import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TabNav from '../components/TabNav';
import recordEvent from 'platform/monitoring/record-event';
import Breadcrumbs from '../components/Breadcrumbs';
import ScheduleNewAppointment from '../components/ScheduleNewAppointment';
import {
  cancelAppointment,
  closeCancelAppointment,
  confirmCancelAppointment,
  fetchFutureAppointments,
  fetchPastAppointments,
  fetchRequestMessages,
  startNewAppointmentFlow,
} from '../actions/appointments';
import CancelAppointmentModal from '../components/cancel/CancelAppointmentModal';
import {
  getCancelInfo,
  vaosCancel,
  vaosRequests,
  vaosPastAppts,
  vaosDirectScheduling,
  vaosCommunityCare,
  isWelcomeModalDismissed,
} from '../utils/selectors';
import { selectIsCernerOnlyPatient } from 'platform/user/selectors';
import { getPastAppointmentDateRangeOptions } from '../utils/appointment';
import { FETCH_STATUS, GA_PREFIX } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import NeedHelp from '../components/NeedHelp';

const pageTitle = 'VA appointments';
const pastAppointmentDateRangeOptions = getPastAppointmentDateRangeOptions();

export class AppointmentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPastDateRangeIndex: 0,
      selectedPastDateRange: pastAppointmentDateRangeOptions[0],
    };
  }

  componentDidMount() {
    const { showPastAppointments } = this.props;
    if (this.props.isWelcomeModalDismissed) {
      scrollAndFocus();
    }

    if (showPastAppointments && this.isPastView()) {
      this.fetchPastAppointments();
    } else {
      this.props.fetchFutureAppointments();
    }

    document.title = `${pageTitle} | Veterans Affairs`;
  }

  componentDidUpdate(prevProps) {
    const { appointments } = this.props;

    if (
      this.props.isWelcomeModalDismissed &&
      !prevProps.isWelcomeModalDismissed
    ) {
      scrollAndFocus();
    }

    if (prevProps.location.pathname !== this.props.location.pathname) {
      if (
        this.isFutureView() &&
        appointments.futureStatus === FETCH_STATUS.notStarted
      ) {
        this.props.fetchFutureAppointments();
      } else if (
        this.isPastView() &&
        appointments.pastStatus === FETCH_STATUS.notStarted
      ) {
        this.fetchPastAppointments();
      }
    }
  }

  onPastAppointmentDateRangeChange = e => {
    const index = Number(e.target.value);
    const selectedPastDateRange = pastAppointmentDateRangeOptions[index];

    this.setState({
      selectedPastDateRangeIndex: index,
      selectedPastDateRange,
    });

    this.props.fetchPastAppointments(
      selectedPastDateRange.startDate,
      selectedPastDateRange.endDate,
    );
  };

  isFutureView = () => this.props.location?.pathname === '/upcoming';

  isPastView = () => this.props.location?.pathname === '/past';

  startNewAppointmentFlow = () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    this.props.startNewAppointmentFlow();
  };

  fetchPastAppointments = () =>
    this.props.fetchPastAppointments(
      this.state.selectedPastDateRange.startDate,
      this.state.selectedPastDateRange.endDate,
    );

  render() {
    const {
      appointments,
      cancelInfo,
      children,
      showCancelButton,
      showScheduleButton,
      showPastAppointments,
      showCommunityCare,
      showDirectScheduling,
      isCernerOnlyPatient,
    } = this.props;

    // const tabClasses = classNames(
    //   'vaos-appts__tab',
    //   'vads-u-background-color--gray-light-alt',
    //   'vads-u-margin--0',
    //   'vads-u-display--inline-block',
    //   'vads-u-text-align--center',
    // );

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs />
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--2">
            <h1 className="vads-u-flex--1">{pageTitle}</h1>
            {showScheduleButton && (
              <ScheduleNewAppointment
                isCernerOnlyPatient={isCernerOnlyPatient}
                showCommunityCare={showCommunityCare}
                showDirectScheduling={showDirectScheduling}
                startNewAppointmentFlow={this.startNewAppointmentFlow}
              />
            )}
            {showPastAppointments && <TabNav />}
            {React.Children.map(children, child =>
              React.cloneElement(
                child,
                child.type.name === 'FutureAppointmentsList'
                  ? {
                      appointments,
                      cancelAppointment: this.props.cancelAppointment,
                      fetchRequestMessages: this.props.fetchRequestMessages,
                      isCernerOnlyPatient,
                      showCancelButton,
                      showScheduleButton,
                      showPastAppointmentsLink: !showPastAppointments,
                      startNewAppointmentFlow: this.props
                        .startNewAppointmentFlow,
                    }
                  : {
                      appointments,
                      dateRangeOptions: pastAppointmentDateRangeOptions,
                      onDateRangeChange: this.onPastAppointmentDateRangeChange,
                      selectedDateRangeIndex: this.state
                        .selectedPastDateRangeIndex,
                    },
              ),
            )}
            <NeedHelp />
          </div>
        </div>
        <CancelAppointmentModal
          {...cancelInfo}
          onConfirm={this.props.confirmCancelAppointment}
          onClose={this.props.closeCancelAppointment}
        />
      </div>
    );
  }
}

AppointmentsPage.propTypes = {
  fetchFutureAppointments: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    appointments: state.appointments,
    cancelInfo: getCancelInfo(state),
    showCancelButton: vaosCancel(state),
    showPastAppointments: vaosPastAppts(state),
    showScheduleButton: vaosRequests(state),
    showCommunityCare: vaosCommunityCare(state),
    showDirectScheduling: vaosDirectScheduling(state),
    isWelcomeModalDismissed: isWelcomeModalDismissed(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
  };
}

const mapDispatchToProps = {
  cancelAppointment,
  closeCancelAppointment,
  confirmCancelAppointment,
  fetchFutureAppointments,
  fetchPastAppointments,
  fetchRequestMessages,
  startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsPage);
