import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { selectPatientFacilities } from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isEqual } from 'lodash';
import classNames from 'classnames';
import { GA_PREFIX } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getPageTitle } from '../newAppointmentFlow';
import {
  routeToNextAppointmentPage,
  startNewAppointmentFlow,
} from '../redux/actions';
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

/**
 * Function to get the migration schedule for the current phase.
 * @param {Array<Object>} schedules - Migration schedules.
 * @param {Array<String>} disabledPhases - Phases to query migration array
 * @returns {Object} A migration schedule or null if not found.
 */
function getMigrationSchedule(schedules, disabledPhases) {
  return (
    schedules?.find(s => {
      return disabledPhases.includes(s.phases.current);
    }) || null
  );
}

/**
 * Function to get array of facility ids from a given migration schedule.
 * @param {Object} migrationSchedule -  Migration schedule
 * @returns {Array<String>} An array of sorted facility ids or null.
 */
function getMigrationScheduleFacilityIds(migrationSchedule) {
  if (migrationSchedule) {
    return migrationSchedule.facilities
      .map(facility => facility.id || facility.facilityId)
      .sort();
  }
  return [];
}

/**
 * Function to determine if user is exclusively registered at Oracle Health facilities.
 * Exclusivity is determined by:
 * - All patient registered facility ids are included in the migration schedule facility table
 *
 * @param {Object} migrationSchedule - Migration schedule.
 * @param {Object} patientFacilities - Patient registered facilities.
 * @returns {Boolean} true or false
 */
function checkExclusiveRegistration(migrationSchedule, patientFacilities) {
  const migratingFacilitiesIds = getMigrationScheduleFacilityIds(
    migrationSchedule,
  );

  const patientFacilityIds = patientFacilities?.map(facility => {
    return facility.facilityId;
  });

  if (isEqual(migratingFacilitiesIds, patientFacilityIds)) return true;

  return patientFacilityIds
    ?.map(patientFacilityId =>
      migratingFacilitiesIds?.some(
        migratingFacilitiesId => migratingFacilitiesId === patientFacilityId,
      ),
    )
    .every(Boolean);
}

/**
 * Function to determine if user is registered at some Oracle Health facilities.
 *
 * @param {Object} migrationSchedule - Migration schedule.
 * @param {Object} patientFacilities - Patient registered facilities.
 * @returns {Boolean} true or false
 */
function checkMixedRegistration(migrationSchedule, patientFacilities) {
  if (checkExclusiveRegistration(migrationSchedule, patientFacilities))
    return false;

  const migratingFacilitiesIds = getMigrationScheduleFacilityIds(
    migrationSchedule,
  );

  const patientFacilityIds = patientFacilities?.map(facility => {
    return facility.facilityId;
  });

  return patientFacilityIds
    ?.map(patientFacilityId =>
      migratingFacilitiesIds?.some(
        migratingFacilitiesId => migratingFacilitiesId === patientFacilityId,
      ),
    )
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
  const isMixedRegistration = checkMixedRegistration(
    migrationSchedule,
    patientFacilities,
  );

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
      {isInWarningPhase &&
        (isExclusiveRegistration || isMixedRegistration) && (
          <MigrationWarning
            facilities={migrationSchedule.facilities}
            startDate={migrationSchedule.phases.p0}
            endDate={migrationSchedule.phases.p7}
          />
        )}
      {isInErrorPhase &&
        (isExclusiveRegistration || isMixedRegistration) && (
          <MigrationInProgressError
            endDate={migrationSchedule.phases.p7}
            facilities={migrationSchedule.facilities}
            isMixedRegistration={isMixedRegistration}
          />
        )}
      {((!isInErrorPhase && !isInWarningPhase) ||
        (isInErrorPhase && isMixedRegistration)) && (
        <>
          <p>
            {' '}
            You can schedule or request non-urgent appointments for future
            dates.{' '}
          </p>
          <a
            className="vads-c-action-link--green vaos-hide-for-print vads-u-margin-bottom--3"
            href="/"
            onClick={handleClick(history, dispatch)}
          >
            Start scheduling an appointment
          </a>
        </>
      )}
      <h2
        className={classNames('vads-u-font-size--h3', 'vads-u-margin--0', {
          'vads-u-margin-top--4': isInErrorPhase,
        })}
      >
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
