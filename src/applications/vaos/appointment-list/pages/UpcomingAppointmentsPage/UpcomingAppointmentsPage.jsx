import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import classNames from 'classnames';
import moment from 'moment';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import InfoAlert from '../../../components/InfoAlert';
import { selectFeatureBreadcrumbUrlUpdate } from '../../../redux/selectors';
import { groupAppointmentByDay } from '../../../services/appointment';
import { FETCH_STATUS, GA_PREFIX } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import BackendAppointmentServiceAlert from '../../components/BackendAppointmentServiceAlert';
import NoAppointments from '../../components/NoAppointments';
import {
  fetchFutureAppointments,
  startNewAppointmentFlow,
} from '../../redux/actions';
import { getUpcomingAppointmentListInfo } from '../../redux/selectors';
import UpcomingAppointmentLayout from '../AppointmentsPage/UpcomingAppointmentLayout';

export default function UpcomingAppointmentsPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    showScheduleButton,
    appointmentsByMonth,
    futureStatus,
    hasTypeChanged,
  } = useSelector(state => getUpcomingAppointmentListInfo(state), shallowEqual);

  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  useEffect(() => {
    recordEvent({
      event: `${GA_PREFIX}-new-appointment-list`,
    });
  }, []);

  useEffect(() => {
    if (futureStatus === FETCH_STATUS.notStarted) {
      dispatch(fetchFutureAppointments());
    } else if (hasTypeChanged && futureStatus === FETCH_STATUS.succeeded) {
      scrollAndFocus('#type-dropdown');
    } else if (hasTypeChanged && futureStatus === FETCH_STATUS.failed) {
      scrollAndFocus('h3');
    }
  }, [dispatch, futureStatus, hasTypeChanged]);

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

  const keys = Object.keys(appointmentsByMonth);

  return (
    <>
      <BackendAppointmentServiceAlert />
      <div aria-live="assertive" className="sr-only">
        {hasTypeChanged && 'Showing upcoming appointments'}
      </div>

      {keys.map((key, index) => {
        const monthDate = moment(key, 'YYYY-MM');

        let hashTable = appointmentsByMonth;
        hashTable = groupAppointmentByDay(hashTable[key]);

        return (
          <React.Fragment key={key}>
            <h2
              className={classNames('vads-u-font-size--h3', {
                'vads-u-margin-top--0': index === 0,
              })}
              data-testid="appointment-list-header"
            >
              {monthDate.format('MMMM YYYY')}
            </h2>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              className={classNames(
                'usa-unstyled-list',
                'vads-u-padding-left--0',
                'vads-u-border-bottom--1px',
                'vads-u-border-color--gray-medium',
              )}
              data-testid={`appointment-list-${monthDate.format('YYYY-MM')}`}
              role="list"
            >
              {UpcomingAppointmentLayout({
                featureBreadcrumbUrlUpdate,
                hashTable,
                history,
              })}
            </ul>
          </React.Fragment>
        );
      })}

      {!keys?.length && (
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
            level={2}
          />
        </div>
      )}
    </>
  );
}
