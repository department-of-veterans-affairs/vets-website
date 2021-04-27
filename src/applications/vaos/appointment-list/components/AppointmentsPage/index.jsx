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
  selectFeatureCovid19Vaccine,
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
import ScheduleNewAppointmentRadioButtons from '../ScheduleNewAppointmentRadioButtons';

const pageTitle = 'VA appointments';

function AppointmentsPage({
  cancelInfo,
  closeCancelAppointment,
  confirmCancelAppointment,
  expressCare,
  featureCovid19Vaccine,
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
          {!featureCovid19Vaccine && (
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
          {featureCovid19Vaccine && <ScheduleNewAppointmentRadioButtons />}
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
          <h2 className="vads-u-margin-y--3">
            Your upcoming and past appointments
          </h2>
          <TabNav />
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
  featureCovid19Vaccine: PropTypes.bool.isRequired,
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
    featureCovid19Vaccine: selectFeatureCovid19Vaccine(state),
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
