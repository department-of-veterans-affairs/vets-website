import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectPatientFacilities } from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
import { isEqual } from 'lodash';
import { GA_PREFIX } from '../../utils/constants';
import { getPageTitle } from '../newAppointmentFlow';
import {
  routeToNextAppointmentPage,
  startNewAppointmentFlow,
} from '../redux/actions';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import MigrationInProgressError from './MigrationInProgressError';
import MigrationWarning from './MigrationWarning';

const pageKey = 'urgentCareInformation';
function handleClick(history, dispatch) {
  return e => {
    // Stop default behavior for anchor tag since we are using React routing.
    e.preventDefault();

    recordEvent({
      event: `${GA_PREFIX}-start-scheduling-link`,
    });
    dispatch(startNewAppointmentFlow());
    dispatch(routeToNextAppointmentPage(history, pageKey));
  };
}

function getMigrationSchedule(schedules, disabledPhases) {
  // return schedules.map(s => disabledPhases.includes(s.phases.current));
  return (
    schedules?.find(s => {
      return disabledPhases.includes(s.phases.current);
    }) || null
  );
}

function getMigrationScheduleFacilityIds(migrationSchedule) {
  if (migrationSchedule) {
    return migrationSchedule.facilities.map(facility => facility.facilityId);
  }
  return [];
}

function checkExclusiveRegistration(migrationSchedule, patientFacilities) {
  const migratingFacilitiesIds = getMigrationScheduleFacilityIds(
    migrationSchedule,
  );

  const patientFacilityIds = patientFacilities?.map(facility => {
    return facility.facilityId;
  });

  return isEqual(migratingFacilitiesIds, patientFacilityIds);
}

function checkMixedRegistration(migrationSchedule, patientFacilities) {
  const migratingFacilitiesIds = getMigrationScheduleFacilityIds(
    migrationSchedule,
  );

  const patientFacilityIds = patientFacilities?.map(facility => {
    return facility.facilityId;
  });

  return patientFacilityIds
    ?.map(current => migratingFacilitiesIds?.some(id => id === current))
    .some(val => val === true);
}

export default function UrgentCareInformationPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));
  const patientFacilities = useSelector(selectPatientFacilities);
  const migrationSchedules = useSelector(
    state => state.user.profile.migrationSchedules,
  );

  // Get migration warning phases.
  let migrationSchedule = getMigrationSchedule(migrationSchedules, [
    'p0',
    'p1',
  ]);
  const isInWarningPhase = !!migrationSchedule;

  // Get migration error phases if not in the warning phase.
  let isInErrorPhase = false;
  if (!isInWarningPhase) {
    migrationSchedule = getMigrationSchedule(migrationSchedules, [
      'p2',
      'p3',
      'p4',
      'p5',
      'p6',
    ]);
    isInErrorPhase = !!migrationSchedule;
  }

  // Check if the user is exclusively registered at the migrating facilities.
  const isExclusiveRegistration = checkExclusiveRegistration(
    migrationSchedule,
    patientFacilities,
  );

  // Check if the user is registred at some of the migrating facilities.
  let isMixedRegistration = false;
  if (!isExclusiveRegistration) {
    isMixedRegistration = checkMixedRegistration(
      migrationSchedule,
      patientFacilities,
    );
  }

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
    },
    [pageTitle],
  );

  useEffect(() => {
    scrollAndFocus();
  }, []);

  return (
    <div>
      <h1 className="vaos__dynamic-font-size--h2">{pageTitle}</h1>
      {isInWarningPhase && (
        <MigrationWarning
          facilities={migrationSchedule.facilities}
          startDate={migrationSchedule.phases[migrationSchedule.phases.current]}
          endDate={migrationSchedule.phases.p7}
        />
      )}
      {isInErrorPhase && (
        <MigrationInProgressError
          endDate={migrationSchedule.phases.p7}
          facilities={migrationSchedule.facilities}
        />
      )}
      <p>
        {' '}
        You can schedule or request non-urgent appointments for future dates.{' '}
      </p>
      {((!isInErrorPhase && !isInWarningPhase) ||
        (isInErrorPhase && isMixedRegistration)) && (
        <a
          className="vads-c-action-link--green vaos-hide-for-print vads-u-margin-bottom--3"
          href="/"
          onClick={handleClick(history, dispatch)}
        >
          Start scheduling an appointment
        </a>
      )}
      <h2 className="vads-u-font-size--h3 vads-u-margin--0">
        If you need help sooner, use one of these urgent communications options:
      </h2>
      <ul>
        <li>
          <strong>If you're in crisis or having thoughts of suicide</strong>,
          connect with our Veterans Crisis Line. We offer confidential support
          anytime, day or night.
        </li>
      </ul>
      <va-button
        class="vads-u-margin-left--3"
        text="Connect with the Veterans Crisis Line"
        secondary
        uswds
        onClick={() => {
          const element = document.getElementById('modal-crisisline');
          element?.classList.add('va-overlay--open');
        }}
      />
      <ul>
        <li>
          <strong>If you think your life or health is in danger</strong>, call{' '}
          <va-telephone contact="911" /> or go to the nearest emergency room.
        </li>
        <li>
          <strong>If you have a minor illness or injury</strong>, you may be
          able to get care faster at an{' '}
          <a href="https://www.va.gov/find-locations/?facilityType=urgent_care">
            urgent care facility
          </a>
          .
        </li>
      </ul>
      <a href="https://www.va.gov/resources/choosing-between-urgent-and-emergency-care/">
        Learn how to choose between urgent and emergency care
      </a>
    </div>
  );
}
