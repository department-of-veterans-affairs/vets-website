import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, useHistory } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';

import ScheduleNewAppointment from './ScheduleNewAppointmentV2';
import * as actions from '../../redux/actions';
import { selectExpressCareAvailability } from '../../redux/selectors';
import {
  selectFeatureRequests,
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
import RequestExpressCare from './RequestExpressCareV2';
import UpcomingAppointmentsList from '../UpcomingAppointmentsList';
import PastAppointmentsList from '../PastAppointmentsList';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import WarningNotification from '../../../components/WarningNotification';
import Select from './Select';

const pageTitle = 'VA appointments';

const options = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Requested', value: 'requested' },
  { label: 'Past', value: 'past' },
  { label: 'Cancelled', value: 'cancelled' },
];

function AppointmentsPageV2({
  expressCare,
  fetchExpressCareWindows,
  isCernerOnlyPatient,
  isWelcomeModalDismissed,
  showCommunityCare,
  showDirectScheduling,
  showScheduleButton,
  startNewAppointmentFlow,
  startNewExpressCareFlow,
  showHomePageRefresh,
}) {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;

    if (
      expressCare.useNewFlow &&
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
  const history = useHistory();

  const routes = (
    <Switch>
      <Route exact path="/" component={UpcomingAppointmentsList} />
      <Route path="/requested" component={UpcomingAppointmentsList} />
      <Route path="/past" component={PastAppointmentsList} />
      <Route path="/cancelled" component={UpcomingAppointmentsList} />
    </Switch>
  );

  function onChange(e) {
    if (e.currentTarget.value === 'upcoming') {
      history.push('/');
    } else if (e.currentTarget.value === 'requested') {
      history.push('/requested');
    } else if (e.currentTarget.value === 'past') {
      history.push('/past');
    } else if (e.currentTarget.value === 'cancelled') {
      history.push('/cancelled');
    }
  }

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
      {expressCare.useNewFlow &&
        !isCernerOnlyPatient && (
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
      <h2 className="vads-u-margin-y--3">Your appointments</h2>
      <label
        htmlFor="type-dropdown"
        className="vads-u-display--inline-block vads-u-margin-top--0 vads-u-margin-right--2"
      >
        Show by type
      </label>
      <Select options={options} onChange={onChange} id="type-dropdown" />
      {routes}
    </>
  );
}

AppointmentsPageV2.propTypes = {
  isCernerOnlyPatient: PropTypes.bool.isRequired,
  isWelcomeModalDismissed: PropTypes.bool.isRequired,
  showCommunityCare: PropTypes.bool.isRequired,
  showDirectScheduling: PropTypes.bool.isRequired,
  startNewAppointmentFlow: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
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
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
  startNewExpressCareFlow: actions.startNewExpressCareFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentsPageV2);
