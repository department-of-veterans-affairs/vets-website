import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
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
import FutureAppointmentsList from '../components/FutureAppointmentsList';
import PastAppointmentsList from '../components/PastAppointmentsList';

const pageTitle = 'VA appointments';
const pastAppointmentDateRangeOptions = getPastAppointmentDateRangeOptions();

const TABS = {
  FUTURE: 0,
  PAST: 1,
};

export class AppointmentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex:
        this.props.location?.query?.view === 'past' ? TABS.PAST : TABS.FUTURE,
      selectedPastDateRangeIndex: 0,
      selectedPastDateRange: pastAppointmentDateRangeOptions[0],
    };
  }

  componentDidMount() {
    if (this.props.isWelcomeModalDismissed) {
      scrollAndFocus();
    }

    if (this.props.showPastAppointments && this.state.tabIndex === TABS.PAST) {
      this.fetchPastAppointments();
    } else {
      this.props.fetchFutureAppointments();
    }

    document.title = `${pageTitle} | Veterans Affairs`;
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isWelcomeModalDismissed &&
      !prevProps.isWelcomeModalDismissed
    ) {
      scrollAndFocus();
    }
  }

  onSelectTab = tabIndex => {
    const { futureStatus, pastStatus } = this.props.appointments;
    this.setState({ tabIndex });

    let path = '';
    if (tabIndex === 0) {
      if (futureStatus === FETCH_STATUS.notStarted) {
        this.props.fetchFutureAppointments();
      }
    } else if (tabIndex === 1) {
      if (pastStatus === FETCH_STATUS.notStarted) {
        this.fetchPastAppointments();
      }

      path = '?view=past';
    }

    this.props.router.push(path);
  };

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
      showCancelButton,
      showScheduleButton,
      showPastAppointments,
      showCommunityCare,
      showDirectScheduling,
      isCernerOnlyPatient,
    } = this.props;

    const { selectedPastDateRangeIndex } = this.state;

    const futureAppointments = (
      <>
        <h3 className="vads-u-margin-y--4">Upcoming appointments</h3>
        {!showPastAppointments && (
          <>
            <p>
              To view past appointments you’ve made,{' '}
              <a
                href={`https://${
                  !environment.isProduction() ? 'mhv-syst' : 'www'
                }.myhealth.va.gov/mhv-portal-web/appointments`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  recordEvent({
                    event: 'vaos-past-appointments-legacy-link-clicked',
                  })
                }
              >
                go to My HealtheVet
              </a>
              .
            </p>
          </>
        )}
        <FutureAppointmentsList
          appointments={appointments}
          cancelAppointment={this.props.cancelAppointment}
          fetchRequestMessages={this.props.fetchRequestMessages}
          showCancelButton={showCancelButton}
          showScheduleButton={showScheduleButton}
          startNewAppointmentFlow={this.startNewAppointmentFlow}
        />
      </>
    );

    const tabClasses = classNames(
      'vaos-appts__tab',
      'vads-u-background-color--gray-light-alt',
      'vads-u-margin--0',
      'vads-u-display--inline-block',
      'vads-u-text-align--center',
    );

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
            {showPastAppointments ? (
              <Tabs
                className="vaos-appts__tabs"
                selectedIndex={this.state.tabIndex}
                onSelect={this.onSelectTab}
              >
                <TabList>
                  <Tab className={tabClasses}>Upcoming appointments</Tab>
                  <Tab className={tabClasses}>Past appointments</Tab>
                </TabList>
                <TabPanel>{futureAppointments}</TabPanel>
                <TabPanel>
                  <h3 className="vads-u-margin-top--4 vads-u-margin-bottom--2p5">
                    Past appointments
                  </h3>
                  <PastAppointmentsList
                    appointments={appointments}
                    dateRangeOptions={pastAppointmentDateRangeOptions}
                    isCernerOnlyPatient
                    onDateRangeChange={this.onPastAppointmentDateRangeChange}
                    selectedDateRangeIndex={selectedPastDateRangeIndex}
                    startNewAppointmentFlow={this.props.startNewAppointmentFlow}
                  />
                </TabPanel>
              </Tabs>
            ) : (
              futureAppointments
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
