import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, useHistory } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';

import ScheduleNewAppointment from './ScheduleNewAppointment';
import * as actions from '../../redux/actions';
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
  selectFeatureProjectCheetah,
  selectFeatureHomepageRefresh,
} from '../../../redux/selectors';
import { GA_PREFIX, FETCH_STATUS } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import RequestExpressCare from './RequestExpressCare';
import FutureAppointmentsListV2 from '../FutureAppointmentsListV2';
import PastAppointmentsList from '../PastAppointmentsList';
import PageLayout from './PageLayout';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import WarningNotification from '../../../components/WarningNotification';
import ScheduleNewProjectCheetah from './ScheduleNewProjectCheetah';
import Select from './Select';

const pageTitle = 'VA appointments';

const options = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Requested', value: 'requested' },
  { label: 'Past', value: 'past' },
  { label: 'Cancelled', value: 'cancelled' },
];

function AppointmentsPageV2({
  cancelInfo,
  expressCare,
  fetchExpressCareWindows,
  isCernerOnlyPatient,
  showCommunityCare,
  showDirectScheduling,
  showScheduleButton,
  showCheetahScheduleButton,
  startNewAppointmentFlow,
  startNewExpressCareFlow,
  showHomePageRefresh,
}) {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;

    if (
      expressCare.enabled &&
      expressCare.windowsStatus === FETCH_STATUS.notStarted
    ) {
      fetchExpressCareWindows();
    }
  }, []);

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
  const history = useHistory();

  const routes = (
    <Switch>
      <Route exact path="/" component={FutureAppointmentsListV2} />
      <Route path="/upcoming" component={FutureAppointmentsListV2} />
      <Route path="/requested" component={FutureAppointmentsListV2} />
      <Route path="/past" component={PastAppointmentsList} />
      <Route path="/cancelled" component={FutureAppointmentsListV2} />
    </Switch>
  );

  function onChange(e) {
    if (e.currentTarget.value === 'upcoming') {
      history.push('/upcoming');
    } else if (e.currentTarget.value === 'requested') {
      history.push('/requested');
    } else if (e.currentTarget.value === 'past') {
      history.push('/past');
    } else if (e.currentTarget.value === 'cancelled') {
      history.push('/cancelled');
    }
  }

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
          showHomePageRefresh={showHomePageRefresh}
          startNewAppointmentFlow={() => {
            recordEvent({
              event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
            });
            startNewAppointmentFlow();
          }}
        />
      )}

      {showCheetahScheduleButton && (
        <ScheduleNewProjectCheetah
          showHomePageRefresh={showHomePageRefresh}
          startNewAppointmentFlow={() => {
            recordEvent({
              event: `${GA_PREFIX}-schedule-project-cheetah-button-clicked`,
            });
            startNewAppointmentFlow();
          }}
        />
      )}

      {expressCare.enabled && (
        <>
          <>
            {!isCernerOnlyPatient && (
              <RequestExpressCare
                {...expressCare}
                showHomePageRefresh={showHomePageRefresh}
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
                Your appointments
              </h2>
            )}

            <label className="vads-u-display--inline-block vads-u-margin-top--0 vads-u-margin-right--2">
              Show by type <span className="sr-only" />
            </label>
            <Select
              options={options}
              onChange={onChange}
              aria-labelledby="options"
            />
            {routes}
          </>
        </>
      )}
    </PageLayout>
  );
}

AppointmentsPageV2.propTypes = {
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
    showCheetahScheduleButton: selectFeatureProjectCheetah(state),
    showHomePageRefresh: selectFeatureHomepageRefresh(state),
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
  fetchPastAppointments: actions.fetchPastAppointments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsPageV2);
