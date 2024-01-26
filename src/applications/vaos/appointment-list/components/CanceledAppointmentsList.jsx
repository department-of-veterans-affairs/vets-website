import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import moment from 'moment';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import {
  fetchFutureAppointments,
  startNewAppointmentFlow,
} from '../redux/actions';
import { getCanceledAppointmentListInfo } from '../redux/selectors';
import {
  FETCH_STATUS,
  GA_PREFIX,
  APPOINTMENT_TYPES,
  SPACE_BAR,
} from '../../utils/constants';
import {
  getLink,
  getVAAppointmentLocationId,
} from '../../services/appointment';
import AppointmentListItem from './AppointmentsPage/AppointmentListItem';
import NoAppointments from './NoAppointments';
import InfoAlert from '../../components/InfoAlert';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import AppointmentCard from './AppointmentsPage/AppointmentCard';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';

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

export default function CanceledAppointmentsList({ hasTypeChanged }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    appointmentsByMonth,
    facilityData,
    futureStatus,
    showScheduleButton,
  } = useSelector(state => getCanceledAppointmentListInfo(state), shallowEqual);
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  useEffect(
    () => {
      if (futureStatus === FETCH_STATUS.notStarted) {
        dispatch(fetchFutureAppointments({ includeRequests: true }));
      } else if (hasTypeChanged && futureStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus('#type-dropdown');
      } else if (hasTypeChanged && futureStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h3');
      }
    },
    [fetchFutureAppointments, futureStatus, hasTypeChanged],
  );

  if (
    futureStatus === FETCH_STATUS.notStarted ||
    futureStatus === FETCH_STATUS.loading
  ) {
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          set-focus={hasTypeChanged}
          message="Loading your canceled appointments..."
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
        We’re having trouble getting your canceled appointments. Please try
        again later.
      </InfoAlert>
    );
  }

  const keys = Object.keys(appointmentsByMonth);
  return (
    <>
      <div aria-live="assertive" className="sr-only">
        {hasTypeChanged && 'Showing canceled appointments and requests'}
      </div>
      {keys.map((key, monthIndex) => {
        const monthDate = moment(key, 'YYYY-MM');
        const monthBucket = appointmentsByMonth[key];

        return (
          <React.Fragment key={monthIndex}>
            <h3
              id={`appointment_list_${monthDate.format('YYYY-MM')}`}
              data-cy="canceled-appointment-list-header"
            >
              <span className="sr-only">Appointments in </span>
              {monthDate.format('MMMM YYYY')}
            </h3>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              aria-labelledby={`appointment_list_${monthDate.format(
                'YYYY-MM',
              )}`}
              className="vads-u-padding-left--0"
              data-cy="canceled-appointment-list"
              role="list"
            >
              {monthBucket.map((appt, index) => {
                const facilityId = getVAAppointmentLocationId(appt);
                const idClickable = `id-${appt.id.replace('.', '\\.')}`;
                const link = getLink({
                  featureBreadcrumbUrlUpdate,
                  appointment: appt,
                });

                if (
                  appt.vaos.appointmentType ===
                    APPOINTMENT_TYPES.vaAppointment ||
                  appt.vaos.appointmentType === APPOINTMENT_TYPES.ccAppointment
                ) {
                  return (
                    <AppointmentListItem
                      key={index}
                      id={appt.id}
                      className="vaos-appts__card--clickable vads-u-margin-bottom--3"
                    >
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
                    </AppointmentListItem>
                  );
                }
                return null;
              })}
            </ul>
          </React.Fragment>
        );
      })}
      {!keys?.length && (
        <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-y--3">
          <NoAppointments
            description="canceled appointments"
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

CanceledAppointmentsList.propTypes = {
  hasTypeChanged: PropTypes.bool,
};
