import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import recordEvent from 'platform/monitoring/record-event';
import moment from 'moment';
import classNames from 'classnames';
import { focusElement } from 'platform/utilities/ui';
import { useHistory } from 'react-router-dom';
import InfoAlert from '../../components/InfoAlert';
import { getUpcomingAppointmentListInfo } from '../redux/selectors';
import {
  FETCH_STATUS,
  GA_PREFIX,
  APPOINTMENT_TYPES,
  SPACE_BAR,
} from '../../utils/constants';
import {
  getVAAppointmentLocationId,
  getLink,
} from '../../services/appointment';
import AppointmentListItem from './AppointmentsPageV2/AppointmentListItem';
import NoAppointments from './NoAppointments';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import {
  fetchFutureAppointments,
  startNewAppointmentFlow,
} from '../redux/actions';
import {
  selectFeatureAppointmentList,
  selectFeatureStatusImprovement,
} from '../../redux/selectors';
import AppointmentCard from './AppointmentsPageV2/AppointmentCard';
import AppointmentGridLayout from './AppointmentsPageV2/AppointmentGridLayout';

function handleClick({ history, link, idClickable }) {
  return () => {
    if (!window.getSelection().toString()) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

function handleKeyDown({ history, link, idClickable }) {
  return event => {
    if (!window.getSelection().toString() && event.keyCode === SPACE_BAR) {
      focusElement(`#${idClickable}`);
      history.push(link);
    }
  };
}

export default function UpcomingAppointmentsList() {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    showScheduleButton,
    appointmentsByMonth,
    futureStatus,
    facilityData,
    hasTypeChanged,
  } = useSelector(state => getUpcomingAppointmentListInfo(state), shallowEqual);
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );
  const featureAppointmentList = useSelector(state =>
    selectFeatureAppointmentList(state),
  );

  useEffect(
    () => {
      if (futureStatus === FETCH_STATUS.notStarted) {
        dispatch(
          fetchFutureAppointments({
            includeRequests: featureStatusImprovement,
          }),
        );
      } else if (hasTypeChanged && futureStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus('#type-dropdown');
      } else if (hasTypeChanged && futureStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h3');
      }
    },
    [dispatch, featureStatusImprovement, futureStatus, hasTypeChanged],
  );

  if (
    futureStatus === FETCH_STATUS.loading ||
    futureStatus === FETCH_STATUS.notStarted
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          set-focus={hasTypeChanged}
          message="Loading your upcoming appointments..."
        />
      </div>
    );
  }

  if (futureStatus === FETCH_STATUS.failed) {
    return (
      <InfoAlert
        status="error"
        headline="We’re sorry. We’ve run into a problem"
      >
        We’re having trouble getting your upcoming appointments. Please try
        again later.
      </InfoAlert>
    );
  }

  return (
    <>
      <div aria-live="assertive" className="sr-only">
        {hasTypeChanged && 'Showing upcoming appointments'}
      </div>

      {appointmentsByMonth.map((monthBucket, monthIndex) => {
        let monthDate;

        if (featureAppointmentList) {
          const key = Object.keys(monthBucket);
          monthDate = moment(key, 'YYYY-MM-DD');
        } else {
          monthDate = moment(monthBucket[0].start);
        }

        return (
          <React.Fragment key={monthIndex}>
            <h3
              id={`appointment_list_${monthDate.format('YYYY-MM')}`}
              data-cy="upcoming-appointment-list-header"
            >
              <span className="sr-only">Appointments in </span>
              {monthDate.format('MMMM YYYY')}
            </h3>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              aria-labelledby={`appointment_list_${monthDate.format(
                'YYYY-MM',
              )}`}
              className={classNames('vads-u-padding-left--0')}
              data-cy="upcoming-appointment-list"
              role="list"
            >
              {featureAppointmentList && (
                <AppointmentGridLayout monthBucket={monthBucket} />
              )}

              {!featureAppointmentList &&
                monthBucket.map((appt, index) => {
                  const facilityId = getVAAppointmentLocationId(appt);
                  const link = getLink({
                    featureStatusImprovement,
                    appointment: appt,
                  });
                  const idClickable = `id-${appt.id.replace('.', '\\.')}`;

                  if (
                    appt.vaos.appointmentType ===
                      APPOINTMENT_TYPES.vaAppointment ||
                    appt.vaos.appointmentType ===
                      APPOINTMENT_TYPES.ccAppointment
                  ) {
                    return (
                      <AppointmentListItem
                        key={index}
                        appointment={appt}
                        facility={facilityData[facilityId]}
                      >
                        {() => (
                          <AppointmentCard
                            appointment={appt}
                            facility={facilityData[facilityId]}
                            link={link}
                            handleClick={() =>
                              handleClick({ history, link, idClickable })
                            }
                            handleKeyDown={() =>
                              handleKeyDown({ history, link, idClickable })
                            }
                          />
                        )}
                      </AppointmentListItem>
                    );
                  }
                  return null;
                })}
            </ul>
          </React.Fragment>
        );
      })}

      {!appointmentsByMonth?.length && (
        <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-y--3">
          <NoAppointments
            description="upcoming appointments"
            showScheduleButton={showScheduleButton}
            startNewAppointmentFlow={() => {
              recordEvent({
                event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
              });
              dispatch(startNewAppointmentFlow());
            }}
          />
        </div>
      )}
    </>
  );
}
