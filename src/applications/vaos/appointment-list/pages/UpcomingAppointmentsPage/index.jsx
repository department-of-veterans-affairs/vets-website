import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import classNames from 'classnames';
import { format, parseISO } from 'date-fns';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import InfoAlert from '../../../components/InfoAlert';
import { groupAppointmentByDay } from '../../../services/appointment';
import {
  selectAppointmentsGroupByMonth,
  useGetAppointmentsQuery,
} from '../../../services/appointment/apiSlice';
import { GA_PREFIX } from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import BackendAppointmentServiceAlert from '../../components/BackendAppointmentServiceAlert';
import NoAppointments from '../../components/NoAppointments';
import { startNewAppointmentFlow } from '../../redux/actions';
import { getUpcomingAppointmentListInfo } from '../../redux/selectors';
import UpcomingAppointmentLayout from '../AppointmentsPage/UpcomingAppointmentLayout';

export default function UpcomingAppointmentsPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    isLoading,
    isSuccess,
    isError,
    isFetching,
  } = useGetAppointmentsQuery();
  const {
    showScheduleButton,
    // appointmentsByMonth,
  } = useSelector(state => getUpcomingAppointmentListInfo(state), shallowEqual);
  const appointmentsByMonth = useSelector(selectAppointmentsGroupByMonth);

  useEffect(() => {
    recordEvent({
      event: `${GA_PREFIX}-new-appointment-list`,
    });
  }, []);

  useEffect(
    () => {
      if (isSuccess) {
        scrollAndFocus('#type-dropdown');
      } else if (isError) {
        scrollAndFocus('h3');
      }
    },
    [dispatch, isError, isSuccess],
  );

  if (isLoading || isFetching) {
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator
          set-focus
          message="Loading your upcoming appointments..."
        />
      </div>
    );
  }

  if (isError) {
    return (
      <InfoAlert
        status="error"
        headline="We can’t access your appointments right now"
      >
        We’re sorry. There’s a problem with our system. Refresh this page or try
        again later.
      </InfoAlert>
    );
  }

  const keys = Object.keys(appointmentsByMonth);

  return (
    <>
      <BackendAppointmentServiceAlert />
      <div aria-live="assertive" className="sr-only">
        Showing upcoming appointments
      </div>

      {keys.map((key, index) => {
        const monthDate = parseISO(key, 'yyyy-MM');

        let hashTable = appointmentsByMonth;
        hashTable = groupAppointmentByDay(hashTable[key]);

        return (
          <React.Fragment key={key}>
            <h2
              className={classNames('vads-u-font-size--h3', {
                'vads-u-margin-top--0': index === 0,
              })}
              data-testid="appointment-list-header"
              data-dd-privacy="mask"
            >
              {format(monthDate, 'MMMM yyyy')}
            </h2>
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              className={classNames(
                'usa-unstyled-list',
                'vads-u-padding-left--0',
                'vads-u-border-bottom--1px',
                'vads-u-border-color--gray-medium',
              )}
              data-testid={`appointment-list-${format(monthDate, 'yyyy-MM')}`}
              data-dd-privacy="mask"
              role="list"
            >
              {UpcomingAppointmentLayout({
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
