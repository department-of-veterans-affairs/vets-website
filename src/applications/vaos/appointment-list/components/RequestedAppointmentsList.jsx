import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { useQuery } from 'react-query';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import { startNewAppointmentFlow } from '../redux/actions';
import {
  selectFeatureRequests,
  selectIsCernerOnlyPatient,
} from '../../redux/selectors';
import { QUERY_STATUS, GA_PREFIX } from '../../utils/constants';
import {
  getAppointmentRequests,
  getVAAppointmentLocationId,
  sortByCreatedDateDescending,
} from '../../services/appointment';
import RequestListItem from './AppointmentsPageV2/RequestListItem';
import NoAppointments from './NoAppointments';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import useFacilitiesQuery from '../../hooks/useFacilitiesQuery';

export default function RequestedAppointmentsList({ hasTypeChanged }) {
  const dispatch = useDispatch();
  const isCernerOnlyPatient = useSelector(selectIsCernerOnlyPatient);
  const showScheduleButton = useSelector(selectFeatureRequests);

  const { data: pendingAppointments, status: pendingStatus } = useQuery(
    ['pending'],
    () =>
      getAppointmentRequests({
        startDate: moment()
          .subtract(120, 'days')
          .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      }),
    {
      select: pending =>
        pending
          .filter(a => !a.vaos.isExpressCare)
          .sort(sortByCreatedDateDescending),
    },
  );

  const { facilityData } = useFacilitiesQuery(
    pendingAppointments
      ?.filter(appt => appt.vaos && !appt.vaos.isCommunityCare)
      .map(getVAAppointmentLocationId),
  );

  useEffect(
    () => {
      if (hasTypeChanged && pendingStatus === QUERY_STATUS.success) {
        scrollAndFocus('#type-dropdown');
      } else if (hasTypeChanged && pendingStatus === QUERY_STATUS.error) {
        scrollAndFocus('h3');
      }
    },
    [pendingStatus, hasTypeChanged],
  );

  if (pendingStatus === QUERY_STATUS.loading) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator
          setFocus={hasTypeChanged}
          message="Loading your appointment requests..."
        />
      </div>
    );
  }

  if (pendingStatus === QUERY_STATUS.error) {
    return (
      <AlertBox status="error" headline="We’re sorry. We’ve run into a problem">
        We’re having trouble getting your appointment requests. Please try again
        later.
      </AlertBox>
    );
  }

  return (
    <>
      <div aria-live="assertive" className="sr-only">
        {hasTypeChanged && 'Showing requested appointments'}
      </div>
      {pendingAppointments?.length > 0 && (
        // eslint-disable-next-line jsx-a11y/no-redundant-roles
        <ul
          role="list"
          className="vads-u-padding-left--0"
          data-cy="requested-appointment-list"
        >
          {pendingAppointments.map((appt, index) => (
            <RequestListItem
              key={index}
              appointment={appt}
              facility={facilityData?.[getVAAppointmentLocationId(appt)]}
            />
          ))}
        </ul>
      )}
      {pendingAppointments?.length === 0 && (
        <div className="vads-u-margin-bottom--2 vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
          <NoAppointments
            showScheduleButton={showScheduleButton}
            isCernerOnlyPatient={isCernerOnlyPatient}
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
