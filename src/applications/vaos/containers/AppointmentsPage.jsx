import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import Breadcrumbs from '../components/Breadcrumbs';
import {
  fetchFutureAppointments,
  cancelAppointment,
  confirmCancelAppointment,
  closeCancelAppointment,
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
import { GA_PREFIX } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import NeedHelp from '../components/NeedHelp';
import FutureAppointmentsList from '../components/FutureAppointmentsList';

const pageTitle = 'VA appointments';

export class AppointmentsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };
  }
  componentDidMount() {
    if (this.props.isWelcomeModalDismissed) {
      scrollAndFocus();
    }
    this.props.fetchFutureAppointments();
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

  render() {
    const {
      appointments,
      cancelInfo,
      showCancelButton,
      showScheduleButton,
      // showPastAppointments,
      showCommunityCare,
      showDirectScheduling,
    } = this.props;

    const showPastAppointments = false;

    const futureAppointments = (
      <FutureAppointmentsList
        appointments={appointments}
        cancelAppointment={this.props.cancelAppointment}
        fetchRequestMessages={this.props.fetchRequestMessages}
        showCancelButton={showCancelButton}
        showScheduleButton={showScheduleButton}
        startNewAppointmentFlow={this.props.startNewAppointmentFlow}
      />
    );

    return (
      <div className="vads-l-grid-container vads-u-padding-x--2p5 large-screen:vads-u-padding-x--0 vads-u-padding-bottom--2p5">
        <Breadcrumbs />
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--2">
            <h1 className="vads-u-flex--1">{pageTitle}</h1>
            {showScheduleButton && (
              <div className="vads-u-padding-y--3 vads-u-border-top--1px">
                <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
                  Create a new appointment
                </h2>
                {showCommunityCare &&
                  showDirectScheduling && (
                    <p className="vads-u-margin-top--1">
                      Schedule an appointment at a VA medical center, clinic, or
                      Community Care facility.
                    </p>
                  )}
                {!showCommunityCare &&
                  !showDirectScheduling && (
                    <p className="vads-u-margin-top--1">
                      Send a request to schedule an appointment at a VA medical
                      center or clinic.
                    </p>
                  )}
                {showCommunityCare &&
                  !showDirectScheduling && (
                    <p className="vads-u-margin-top--1">
                      Send a request to schedule an appointment at a VA medical
                      center, clinic, or Community Care facility.
                    </p>
                  )}
                {!showCommunityCare &&
                  showDirectScheduling && (
                    <p className="vads-u-margin-top--1">
                      Schedule an appointment at a VA medical center or clinic.
                    </p>
                  )}
                <Link
                  id="new-appointment"
                  className="usa-button vads-u-font-weight--bold vads-u-font-size--md"
                  to="/new-appointment"
                  onClick={() => {
                    recordEvent({
                      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
                    });
                    this.props.startNewAppointmentFlow();
                  }}
                >
                  Schedule an appointment
                </Link>
              </div>
            )}
            {showPastAppointments && (
              <Tabs
                className="vaos-appts__tabs"
                selectedIndex={this.state.tabIndex}
                onSelect={tabIndex => this.setState({ tabIndex })}
              >
                <TabList>
                  <Tab className="small-4 vaos-appts__tab">
                    Upcoming appointments
                  </Tab>
                  <Tab className="small-4 vaos-appts__tab">
                    Past appointments
                  </Tab>
                </TabList>
                <TabPanel>{futureAppointments}</TabPanel>
                <TabPanel>test 2</TabPanel>
              </Tabs>
            )}

            {!showPastAppointments && (
              <>
                {futureAppointments}
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
  };
}

const mapDispatchToProps = {
  fetchFutureAppointments,
  fetchRequestMessages,
  cancelAppointment,
  confirmCancelAppointment,
  closeCancelAppointment,
  startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsPage);
