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
 * Function to get patient facility ids.
 * @param {Array} patientFacilities - Patient facility information array
 * @returns {Array} Array of patient facility ids or null.
 */
function getPatientFacilityIds(patientFacilities) {
  return (
    patientFacilities?.map(facility => {
      return facility.facilityId;
    }) || null
  );
}

/**
 * Function to determine if user is registered at Oracle Health facilities. When exclusivity flag
 * is set, exclusivity is determined by:
 * - All patient registered facility ids are included in the migration schedule facility table
 *
 * @param {Object} arguments
 * @param {Object} arguments.migrationSchedule - Migration schedule.
 * @param {Array<Object>} arguments.patientFacilities - Patient registered facilities.
 * @param {Boolean} arguments.isExclusive - Flag to check for exclusivity.
 * @returns {Boolean} true or false
 */
function checkRegistration({
  migrationSchedule,
  patientFacilities,
  isExclusive = false,
}) {
  if (!patientFacilities) return false;

  const migratingFacilitiesIds = getMigrationScheduleFacilityIds(
    migrationSchedule,
  );

  const patientFacilityIds = getPatientFacilityIds(patientFacilities);

  if (isExclusive) {
    if (patientFacilityIds?.length === migratingFacilitiesIds.length) {
      return isEqual(migratingFacilitiesIds, patientFacilityIds);
    }

    // Ex. [1,2], [1,2,3] is still considered exclusive registration if all of the user's
    // registered facility ids match the migration facility ids.
    if (patientFacilityIds?.length < migratingFacilitiesIds.length) {
      return patientFacilityIds
        ?.map(patientFacilityId =>
          migratingFacilitiesIds?.some(
            migratingFacilitiesId =>
              migratingFacilitiesId === patientFacilityId,
          ),
        )
        .every(Boolean);
    }

    // Ex. [1,2][1] is considered mixed
    return false;
  }

  if (patientFacilityIds?.length === migratingFacilitiesIds.length) {
    // Exclusive registration. [1][1]
    if (isEqual(patientFacilityIds, migratingFacilitiesIds)) return false;

    // Ex.[1,2], [1,3] is considered mixed.
    return patientFacilityIds
      ?.map(patientFacilityId =>
        migratingFacilitiesIds?.some(
          migratingFacilitiesId => migratingFacilitiesId === patientFacilityId,
        ),
      )
      .some(val => val === true);
  }

  // Ex. [1,2], [1] is considered mixed registration
  if (patientFacilityIds?.length > migratingFacilitiesIds.length) {
    return patientFacilityIds
      ?.map(patientFacilityId =>
        migratingFacilitiesIds?.some(
          migratingFacilitiesId => migratingFacilitiesId === patientFacilityId,
        ),
      )
      .some(Boolean);
  }

  // Ex. [1][1,2] is considered exlusive
  return false;
}

/**
 * Function to determine is the 'Start scheduling' button should be displayed.
 *
 * @param {Boolean} isInWarningPhase
 * @param {Boolean} isInErrorPhase
 * @param {Boolean} isMixedRegistration
 * @param {Boolean} isExclusiveRegistration
 * @returns {Boolean}
 */
function shouldDisplay(
  isInWarningPhase,
  isInErrorPhase,
  isMixedRegistration,
  isErrorExclusiveRegistration,
) {
  let isDisplay = false;

  // Display start scheduling button when...
  if (!isInErrorPhase && !isInWarningPhase) {
    isDisplay = true;
  }

  if (isInWarningPhase === true) {
    isDisplay = true;
  }

  if (isInErrorPhase && isMixedRegistration && !isErrorExclusiveRegistration) {
    isDisplay = true;
  }

  // This occurs when in the migration phase but user is not registered at any of the
  // migration facilities.
  if (isErrorExclusiveRegistration === false && isMixedRegistration === false) {
    isDisplay = true;
  }

  return isDisplay;
}

export default function UrgentCareInformationPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));
  const patientFacilities = useSelector(selectPatientFacilities);
  const migrationSchedules = useSelector(
    state => state.user.profile.migrationSchedules,
  );

  // Get warning migration schedule for the given phases.
  const warningSchedule = getMigrationSchedule(migrationSchedules, [
    'p0',
    'p1',
  ]);

  // Get error migration schedule for the given phases.
  const errorSchedule = getMigrationSchedule(migrationSchedules, [
    'p2',
    'p3',
    'p4',
    'p5',
    'p6',
  ]);

  // Check for exclusive registration in the warning migration schedule
  const isWarningExclusiveRegistration = checkRegistration({
    migrationSchedule: warningSchedule,
    patientFacilities,
    isExclusive: true,
  });

  // Check for exclusive registration in the error migration schedule
  const isErrorExclusiveRegistration = checkRegistration({
    migrationSchedule: errorSchedule,
    patientFacilities,
    isExclusive: true,
  });

  // Warning phase is determined by the user being registered (exclusively or not) at a facility in
  // the warning migration phase.
  const isInWarningPhase =
    isWarningExclusiveRegistration ||
    checkRegistration({
      migrationSchedule: warningSchedule,
      patientFacilities,
    });

  const isMixedRegistration = checkRegistration({
    migrationSchedule: errorSchedule,
    patientFacilities,
  });
  const isInErrorPhase = isMixedRegistration || isErrorExclusiveRegistration;

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
        (isWarningExclusiveRegistration || isMixedRegistration) && (
          <MigrationWarning
            facilities={warningSchedule.facilities}
            startDate={warningSchedule.phases.p0}
            endDate={warningSchedule.phases.p7}
          />
        )}
      {isInErrorPhase &&
        (isErrorExclusiveRegistration || isMixedRegistration) && (
          <MigrationInProgressError
            endDate={errorSchedule.phases.p7}
            facilities={errorSchedule.facilities}
            isMixedRegistration={isMixedRegistration}
          />
        )}
      {shouldDisplay(
        isInWarningPhase,
        isInErrorPhase,
        isMixedRegistration,
        isErrorExclusiveRegistration,
      ) && (
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
