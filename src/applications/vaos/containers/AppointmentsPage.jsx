import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';

import Breadcrumbs from '../components/Breadcrumbs';
import ScheduleNewAppointment from '../components/ScheduleNewAppointment';
import {
  closeCancelAppointment,
  confirmCancelAppointment,
  startNewAppointmentFlow,
  fetchFutureAppointments,
} from '../actions/appointments';
import {
  fetchExpressCareWindows,
  startNewExpressCareFlow,
} from '../actions/expressCare';
import CancelAppointmentModal from '../components/cancel/CancelAppointmentModal';
import {
  getCancelInfo,
  vaosRequests,
  vaosPastAppts,
  vaosDirectScheduling,
  vaosCommunityCare,
  vaosExpressCare,
  isWelcomeModalDismissed,
  selectExpressCare,
} from '../utils/selectors';
import { selectIsCernerOnlyPatient } from 'platform/user/selectors';
import { GA_PREFIX, FETCH_STATUS } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import NeedHelp from '../components/NeedHelp';
import TabNav from '../components/TabNav';
import RequestExpressCare from '../components/RequestExpressCare';

const pageTitle = 'VA appointments';

export class AppointmentsPage extends Component {
  componentDidMount() {
    if (this.props.isWelcomeModalDismissed) {
      scrollAndFocus();
    }

    if (
      this.props.showExpressCare &&
      this.props.futureStatus === FETCH_STATUS.notStarted
    ) {
      this.props.fetchFutureAppointments();
    }

    document.title = `${pageTitle} | Veterans Affairs`;
    if (
      this.props.expressCare.enabled &&
      this.props.expressCare.windowsStatus === FETCH_STATUS.notStarted
    ) {
      this.props.fetchExpressCareWindows();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isWelcomeModalDismissed &&
      !prevProps.isWelcomeModalDismissed
    ) {
      scrollAndFocus();
    }
  }

  startNewAppointmentFlow = () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    this.props.startNewAppointmentFlow();
  };

  startNewExpressCareFlow = () => {
    recordEvent({
      event: `${GA_PREFIX}-express-care-request-button-clicked`,
    });
    this.props.startNewExpressCareFlow();
  };

  render() {
    const {
      cancelInfo,
      children,
      futureStatus,
      showScheduleButton,
      showCommunityCare,
      expressCare,
      showDirectScheduling,
      isCernerOnlyPatient,
      showPastAppointments,
    } = this.props;
    const isLoading =
      futureStatus === FETCH_STATUS.loading ||
      expressCare.windowsStatus === FETCH_STATUS.loading ||
      futureStatus === FETCH_STATUS.notStarted ||
      expressCare.windowsStatus === FETCH_STATUS.notStarted;

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
            {!expressCare.enabled && (
              <>
                {showPastAppointments && <TabNav />}
                {children}
              </>
            )}
            {expressCare.enabled && (
              <>
                {isLoading && (
                  <LoadingIndicator message="Loading your appointment information" />
                )}
                {!isLoading && (
                  <>
                    {!isCernerOnlyPatient && (
                      <RequestExpressCare
                        {...expressCare}
                        startNewExpressCareFlow={this.startNewExpressCareFlow}
                      />
                    )}
                    {expressCare.hasRequests && (
                      <h2 className="vads-u-font-size--h3 vads-u-margin-y--3">
                        View your upcoming, past, and Express Care appointments
                      </h2>
                    )}
                    <TabNav hasExpressCareRequests={expressCare.hasRequests} />
                    {children}
                  </>
                )}
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
  cancelInfo: PropTypes.object,
  closeCancelAppointment: PropTypes.func.isRequired,
  confirmCancelAppointment: PropTypes.func.isRequired,
  isCernerOnlyPatient: PropTypes.bool.isRequired,
  isWelcomeModalDismissed: PropTypes.bool.isRequired,
  showPastAppointments: PropTypes.bool.isRequired,
  showCommunityCare: PropTypes.bool.isRequired,
  showDirectScheduling: PropTypes.bool.isRequired,
  startNewAppointmentFlow: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    futureStatus: state.appointments.futureStatus,
    cancelInfo: getCancelInfo(state),
    showPastAppointments: vaosPastAppts(state),
    showScheduleButton: vaosRequests(state),
    showCommunityCare: vaosCommunityCare(state),
    showDirectScheduling: vaosDirectScheduling(state),
    showExpressCare: vaosExpressCare(state),
    isWelcomeModalDismissed: isWelcomeModalDismissed(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    expressCare: selectExpressCare(state),
  };
}

const mapDispatchToProps = {
  fetchExpressCareWindows,
  closeCancelAppointment,
  confirmCancelAppointment,
  startNewAppointmentFlow,
  startNewExpressCareFlow,
  fetchFutureAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsPage);
