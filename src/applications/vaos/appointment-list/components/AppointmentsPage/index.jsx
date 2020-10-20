import React, { Component } from 'react';
import '../../../sass/appointment-list.scss';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';

import ScheduleNewAppointment from './ScheduleNewAppointment';
import {
  closeCancelAppointment,
  confirmCancelAppointment,
  startNewAppointmentFlow,
  fetchFutureAppointments,
  fetchExpressCareWindows,
} from '../../redux/actions';
import { startNewExpressCareFlow } from '../../../express-care/redux/actions';
import CancelAppointmentModal from '../cancel/CancelAppointmentModal';
import {
  getCancelInfo,
  vaosRequests,
  vaosPastAppts,
  vaosDirectScheduling,
  vaosCommunityCare,
  vaosExpressCare,
  isWelcomeModalDismissed,
  selectExpressCare,
  selectFutureStatus,
} from '../../../utils/selectors';
import { selectIsCernerOnlyPatient } from 'platform/user/selectors';
import { GA_PREFIX, FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import TabNav from './TabNav';
import RequestExpressCare from './RequestExpressCare';
import FutureAppointmentsList from '../FutureAppointmentsList';
import PastAppointmentsList from '../PastAppointmentsList';
import ExpressCareList from '../ExpressCareList';
import PageLayout from './PageLayout';

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
      pendingStatus,
      showScheduleButton,
      showCommunityCare,
      expressCare,
      showDirectScheduling,
      isCernerOnlyPatient,
      showPastAppointments,
    } = this.props;
    const isLoading =
      pendingStatus === FETCH_STATUS.loading ||
      expressCare.windowsStatus === FETCH_STATUS.loading ||
      pendingStatus === FETCH_STATUS.notStarted ||
      expressCare.windowsStatus === FETCH_STATUS.notStarted;

    const routes = (
      <Switch>
        <Route component={PastAppointmentsList} path="/past" />
        <Route component={ExpressCareList} path="/express-care" />
        <Route path="/" component={FutureAppointmentsList} />
      </Switch>
    );
    return (
      <PageLayout>
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
            {routes}
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
                    Your upcoming, past, and Express Care appointments
                  </h2>
                )}
                <TabNav hasExpressCareRequests={expressCare.hasRequests} />
                {routes}
              </>
            )}
          </>
        )}
        <CancelAppointmentModal
          {...cancelInfo}
          onConfirm={this.props.confirmCancelAppointment}
          onClose={this.props.closeCancelAppointment}
        />
      </PageLayout>
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
    pendingStatus: state.appointments.pendingStatus,
    futureStatus: selectFutureStatus(state),
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
