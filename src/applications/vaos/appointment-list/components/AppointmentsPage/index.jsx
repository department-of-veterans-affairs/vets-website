import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';

import ScheduleNewAppointment from './ScheduleNewAppointment';
import * as actions from '../../redux/actions';
import CancelAppointmentModal from '../cancel/CancelAppointmentModal';
import {
  getCancelInfo,
  selectFutureStatus,
  selectExpressCareAvailability,
  selectCanUseVaccineFlow,
  selectDirectScheduleSettingsStatus,
} from '../../redux/selectors';
import {
  selectFeatureRequests,
  selectFeatureDirectScheduling,
  selectFeatureCommunityCare,
  selectIsWelcomeModalDismissed,
  selectIsCernerOnlyPatient,
  selectFeatureProjectCheetah,
} from '../../../redux/selectors';
import { GA_PREFIX, FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import TabNav from './TabNav';
import RequestExpressCare from './RequestExpressCare';
import FutureAppointmentsList from '../FutureAppointmentsList';
import PastAppointmentsList from '../PastAppointmentsList';
import ExpressCareList from '../ExpressCareList';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import WarningNotification from '../../../components/WarningNotification';
import ScheduleNewAppointmentRadioButtons from './ScheduleNewAppointmentRadioButtons';

const pageTitle = 'VA appointments';

function AppointmentsPage({
  cancelInfo,
  closeCancelAppointment,
  confirmCancelAppointment,
  expressCare,
  featureProjectCheetah,
  fetchFutureAppointments,
  fetchExpressCareWindows,
  futureStatus,
  isCernerOnlyPatient,
  isWelcomeModalDismissed,
  showCommunityCare,
  showDirectScheduling,
  pendingStatus,
  showScheduleButton,
  startNewAppointmentFlow,
  startNewExpressCareFlow,
}) {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;

    if (futureStatus === FETCH_STATUS.notStarted) {
      fetchFutureAppointments();
    }

    if (expressCare.windowsStatus === FETCH_STATUS.notStarted) {
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
    <>
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
        <>
          {!featureProjectCheetah && (
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
          {featureProjectCheetah && <ScheduleNewAppointmentRadioButtons />}
        </>
      )}

      {isLoading && (
        <LoadingIndicator message="Loading your appointment information" />
      )}
      {!isLoading && (
        <>
          {!isCernerOnlyPatient &&
            expressCare.useNewFlow && (
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
      <CancelAppointmentModal
        {...cancelInfo}
        onConfirm={confirmCancelAppointment}
        onClose={closeCancelAppointment}
      />
    </>
  );
}

AppointmentsPage.propTypes = {
  cancelInfo: PropTypes.object,
  closeCancelAppointment: PropTypes.func.isRequired,
  confirmCancelAppointment: PropTypes.func.isRequired,
  isCernerOnlyPatient: PropTypes.bool.isRequired,
  isWelcomeModalDismissed: PropTypes.bool.isRequired,
  showCommunityCare: PropTypes.bool.isRequired,
  showDirectScheduling: PropTypes.bool.isRequired,
  startNewAppointmentFlow: PropTypes.func.isRequired,
  featureProjectCheetah: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    pendingStatus: state.appointments.pendingStatus,
    futureStatus: selectFutureStatus(state),
    cancelInfo: getCancelInfo(state),
    canUseVaccineFlow: selectCanUseVaccineFlow(state),
    directScheduleSettingsStatus: selectDirectScheduleSettingsStatus(state),
    showScheduleButton: selectFeatureRequests(state),
    showCommunityCare: selectFeatureCommunityCare(state),
    showDirectScheduling: selectFeatureDirectScheduling(state),
    featureProjectCheetah: selectFeatureProjectCheetah(state),
    isWelcomeModalDismissed: selectIsWelcomeModalDismissed(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    expressCare: selectExpressCareAvailability(state),
  };
}

const mapDispatchToProps = {
  fetchExpressCareWindows: actions.fetchExpressCareWindows,
  fetchDirectScheduleSettings: actions.fetchDirectScheduleSettings,
  closeCancelAppointment: actions.closeCancelAppointment,
  confirmCancelAppointment: actions.confirmCancelAppointment,
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
  startNewExpressCareFlow: actions.startNewExpressCareFlow,
  startNewVaccineFlow: actions.startNewVaccineFlow,
  fetchFutureAppointments: actions.fetchFutureAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsPage);
