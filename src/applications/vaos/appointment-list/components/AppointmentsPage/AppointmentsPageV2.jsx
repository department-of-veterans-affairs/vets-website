import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
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
import RequestedAppointmentsList from '../RequestedAppointmentsList';
import UpcomingAppointmentsList from '../UpcomingAppointmentsList';
import PastAppointmentsList from '../PastAppointmentsList';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import WarningNotification from '../../../components/WarningNotification';
import Select from './Select';

const pageTitle = 'VA appointments';

const DROPDOWN_VALUES = {
  upcoming: 'upcoming',
  requested: 'requested',
  past: 'past',
  cancelled: 'cancelled',
};

const options = [
  { label: 'Upcoming', value: DROPDOWN_VALUES.upcoming },
  { label: 'Requested', value: DROPDOWN_VALUES.requested },
  { label: 'Past', value: DROPDOWN_VALUES.past },
  { label: 'Cancelled', value: DROPDOWN_VALUES.cancelled },
];

function getDropdownValueFromLocation(pathname) {
  if (pathname.endsWith(DROPDOWN_VALUES.requested)) {
    return DROPDOWN_VALUES.requested;
  } else if (pathname.endsWith(DROPDOWN_VALUES.past)) {
    return DROPDOWN_VALUES.past;
  } else if (pathname.endsWith(DROPDOWN_VALUES.cancelled)) {
    return DROPDOWN_VALUES.cancelled;
  } else {
    return DROPDOWN_VALUES.upcoming;
  }
}

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
}) {
  const location = useLocation();

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
      <Route path="/requested" component={RequestedAppointmentsList} />
      <Route path="/past" component={PastAppointmentsList} />
      <Route path="/cancelled" component={UpcomingAppointmentsList} />
    </Switch>
  );

  function onDropdownChange(e) {
    const value = e.target.value;
    if (value === DROPDOWN_VALUES.upcoming) {
      history.push('/');
    } else if (value === DROPDOWN_VALUES.requested) {
      history.push('/requested');
    } else if (value === DROPDOWN_VALUES.past) {
      history.push('/past');
    } else if (value === DROPDOWN_VALUES.cancelled) {
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
      <Select
        options={options}
        onChange={onDropdownChange}
        id="type-dropdown"
        value={getDropdownValueFromLocation(location.pathname)}
      />
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
