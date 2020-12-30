import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';

import ScheduleNewAppointment from './ScheduleNewAppointment';
import * as actions from '../../redux/actions';
import CancelAppointmentModal from '../cancel/CancelAppointmentModal';
import {
  getCancelInfo,
  selectFutureStatus,
  selectExpressCareAvailability,
} from '../../redux/selectors';
import {
  selectFeatureRequests,
  selectFeaturePastAppointments,
  selectFeatureDirectScheduling,
  selectFeatureCommunityCare,
  selectFeatureExpressCare,
  selectIsWelcomeModalDismissed,
  selectIsCernerOnlyPatient,
} from '../../../redux/selectors';
import { GA_PREFIX, FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import TabNav from './TabNav';
import RequestExpressCare from './RequestExpressCare';
import FutureAppointmentsList from '../FutureAppointmentsList';
import PastAppointmentsList from '../PastAppointmentsList';
import ExpressCareList from '../ExpressCareList';
import PageLayout from './PageLayout';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import WarningNotification from '../../../components/WarningNotification';

const pageTitle = 'VA appointments';

function AppointmentsPage({
  cancelInfo,
  closeCancelAppointment,
  confirmCancelAppointment,
  expressCare,
  fetchFutureAppointments,
  fetchExpressCareWindows,
  futureStatus,
  isCernerOnlyPatient,
  isWelcomeModalDismissed,
  pendingStatus,
  showCommunityCare,
  showDirectScheduling,
  showExpressCare,
  showPastAppointments,
  showScheduleButton,
  startNewAppointmentFlow,
  startNewExpressCareFlow,
}) {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;

    if (showExpressCare && futureStatus === FETCH_STATUS.notStarted) {
      fetchFutureAppointments();
    }

    if (
      expressCare.enabled &&
      expressCare.windowsStatus === FETCH_STATUS.notStarted
    ) {
      fetchExpressCareWindows();
    }
  }, []);

  useEffect(
    () => {
      if (isWelcomeModalDismissed) {
        scrollAndFocus();
      }
    },
    [isWelcomeModalDismissed],
  );

  useEffect(
    () => {
      if (
        !cancelInfo.showCancelModal &&
        cancelInfo.cancelAppointmentStatus === FETCH_STATUS.succeeded
      ) {
        scrollAndFocus();
      }
    },
    [cancelInfo.showCancelModal, cancelInfo.cancelAppointmentStatus],
  );

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
      <DowntimeNotification
        appTitle="VA online scheduling tool"
        isReady
        dependencies={[externalServices.vaosWarning]}
        render={(props, childContent) => (
          <WarningNotification {...props}>{childContent}</WarningNotification>
        )}
      />

      {showScheduleButton && (
        <ScheduleNewAppointment
          isCernerOnlyPatient={isCernerOnlyPatient}
          showCommunityCare={showCommunityCare}
          showDirectScheduling={showDirectScheduling}
          startNewAppointmentFlow={() => {
            recordEvent({
              event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
            });
            startNewAppointmentFlow();
          }}
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
                  startNewExpressCareFlow={() => {
                    recordEvent({
                      event: `${GA_PREFIX}-express-care-request-button-clicked`,
                    });
                    startNewExpressCareFlow();
                  }}
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
        onConfirm={confirmCancelAppointment}
        onClose={closeCancelAppointment}
      />
    </PageLayout>
  );
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
    showPastAppointments: selectFeaturePastAppointments(state),
    showScheduleButton: selectFeatureRequests(state),
    showCommunityCare: selectFeatureCommunityCare(state),
    showDirectScheduling: selectFeatureDirectScheduling(state),
    showExpressCare: selectFeatureExpressCare(state),
    isWelcomeModalDismissed: selectIsWelcomeModalDismissed(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    expressCare: selectExpressCareAvailability(state),
  };
}

const mapDispatchToProps = {
  fetchExpressCareWindows: actions.fetchExpressCareWindows,
  closeCancelAppointment: actions.closeCancelAppointment,
  confirmCancelAppointment: actions.confirmCancelAppointment,
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
  startNewExpressCareFlow: actions.startNewExpressCareFlow,
  fetchFutureAppointments: actions.fetchFutureAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsPage);
