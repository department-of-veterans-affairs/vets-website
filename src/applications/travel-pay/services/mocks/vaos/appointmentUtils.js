const { randomInt } = require('crypto');
const { STATUS_KEYS } = require('../constants');

/**
 * Format a Date object to ISO string with local timezone offset
 * Example: "2025-04-15T06:30:00.000-04:00"
 */
function toLocalISOString(date) {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  const pad = n => String(n).padStart(2, '0');
  const offsetHours = pad(Math.floor(Math.abs(tzOffset) / 60));
  const offsetMinutes = pad(Math.abs(tzOffset) % 60);

  return date
    .toISOString()
    .replace('Z', `${diff}${offsetHours}:${offsetMinutes}`);
}

/**
 * Generate mock appointment timestamps for VAOS and Travel Pay.
 *
 * - `start` / `end`: true UTC instants used by VAOS
 * - `localStartTime`: local time with timezone offset for UI display
 * - `appointmentDateTime`: local wall-clock time serialized as UTC (`Z`)
 *   to match Travel Pay behavior
 *
 * @param {number} index - Day offset from today (negative = past)
 * @param {number} [startHour=8] - Base local start hour (30-min aligned)
 */
function generateAppointmentDates(index, startHour = 8) {
  const now = new Date();

  // Local wall-clock date
  const localDate = new Date(now);
  localDate.setDate(now.getDate() + index);

  // 30-minute increments
  const hour = startHour + (index % 16) * 0.5;
  localDate.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);

  // Local string WITH offset
  const localStartTime = toLocalISOString(localDate);

  // True UTC instant
  const start = new Date(localDate.getTime()).toISOString();
  const end = new Date(localDate.getTime() + 30 * 60 * 1000).toISOString();

  // Wall-clock local time serialized as Z (Travel Pay behavior)
  const appointmentDateTime = localStartTime.replace(/\.\d{3}.+$/, 'Z');

  return {
    start,
    end,
    localStartTime,
    appointmentDateTime,
  };
}

/**
 * Build a mock VAOS appointment object from a travel pay claim.
 *
 * @param {Object} claim - The travel pay claim object
 * @param {number} daysOffset - Number of days to offset the appointment from today
 * @returns {Object} VAOS-formatted appointment object
 */
function buildVaosAppointmentFromClaim(claim, daysOffset) {
  // Generate start/end times and local strings for the appointment
  const {
    start, // UTC start time
    end, // UTC end time
    localStartTime,
    appointmentDateTime,
  } = generateAppointmentDates(daysOffset);

  // Generate a random ID if claim doesn't already have an appointment
  const savedClaimAppointmentId = randomInt(100000, 999999).toString();
  return {
    id: claim.appointment?.id || savedClaimAppointmentId,
    type: 'appointments',
    attributes: {
      id: claim.appointment?.id || savedClaimAppointmentId,
      identifier: [
        {
          system: 'Appointment/',
          value:
            claim.appointment?.externalAppointmentId ||
            `${randomInt(10000000, 99999999)}-0000-0000-0000-000000000001`,
        },
        {
          system: 'VistADefinedTerms/409_84',
          value: `${claim.appointment?.facilityId || '534'}:${claim.appointment
            ?.clinic || '10876'}`,
        },
      ],
      kind: 'clinic',
      status: 'booked',
      serviceCategory: [
        {
          coding: [
            {
              system: 'VistADefinedTerms/409_1',
              code: 'REGULAR',
              display: 'REGULAR',
            },
          ],
          text: 'REGULAR',
        },
      ],
      patientIcn: claim.patientIcn || '1013125218V696863',
      locationId: claim.appointment?.facilityId || '534',
      clinic: claim.appointment?.clinic || '1081',
      start,
      end,
      minutesDuration: 30,
      slot: {
        id: randomInt(100000, 999999).toString(),
        start,
        end,
      },
      created: claim.createdOn,
      cancellable: true,
      extension: {
        ccLocation: { address: {} },
        vistaStatus: ['NO ACTION TAKEN'],
        preCheckinAllowed: true,
        eCheckinAllowed: true,
        clinic: {},
      },
      localStartTime,
      station: claim.appointment?.facilityId || '534',
      travelPayClaim: {
        metadata: {
          status: 200,
          success: true,
          message: 'Data retrieved successfully.',
        },
        claim: {
          id: claim.id,
          claimNumber: claim.claimNumber,
          claimSource: claim.claimSource,
          claimStatus: claim.claimStatus,
          appointmentDateTime,
          externalAppointmentId: claim.appointment?.externalAppointmentId,
          facilityId: claim.appointment?.facilityId,
          facilityName: 'Peri',
          totalCostRequested: claim.totalCostRequested,
          reimbursementAmount: claim.reimbursementAmount,
          createdOn: claim.createdOn,
          modifiedOn: claim.modifiedOn,
        },
      },
    },
  };
}

/**
 * Build VAOS-style appointments from a list of Travel Pay claims.
 *
 * Each claim is converted into a VAOS appointment using `buildVaosAppointmentFromClaim`,
 * and optionally identifies a "saved" claim and its corresponding appointment.
 *
 * @param {Array} baseClaimList - List of travel pay claim objects
 * @param {string} claimStatus - Claim status to mark as the "saved" claim (default: STATUS_KEYS.SAVED)
 * @returns {Object} {
 *   baseAppointments: Array of VAOS appointment objects,
 *   savedClaim: The claim object with matching claimStatus,
 *   savedClaimAppointment: VAOS appointment corresponding to savedClaim
 * }
 */
const buildAppointmentsFromClaims = (
  baseClaimList,
  claimStatus = STATUS_KEYS.SAVED,
) => {
  const baseAppointments = baseClaimList.map((claim, index) => {
    const daysOffset = -(index + 2); // negative index minus 2 days
    return buildVaosAppointmentFromClaim(claim, daysOffset);
  });

  const savedClaim = baseClaimList.find(
    claim => claim.claimStatus === claimStatus,
  );

  let savedClaimAppointment;

  if (savedClaim) {
    savedClaimAppointment = baseAppointments.find(appt => {
      const apptClaimNumber =
        appt?.attributes?.travelPayClaim?.claim?.claimNumber;
      return apptClaimNumber === savedClaim.claimNumber;
    });

    if (savedClaimAppointment) {
      savedClaimAppointment.attributes.travelPayClaim = {
        claim: {
          ...savedClaim,
        },
      };
    }
  }

  return {
    baseAppointments,
    savedClaim,
    savedClaimAppointment,
  };
};

/**
 * Build a standalone community care (CC) VAOS appointment with no existing travel pay claim.
 * Use this appointment to test the proof of attendance upload flow end-to-end.
 *
 * Navigate to: /my-health/travel-pay/file-new-claim/cc-appt-001
 *
 * @param {number} [daysOffset=-3] - Days in the past relative to today
 * @returns {Object} VAOS-formatted CC appointment
 */
function buildCCAppointment(daysOffset = -3) {
  const id = 'cc-appt-001';
  const { start, end, localStartTime } = generateAppointmentDates(daysOffset);

  return {
    id,
    type: 'appointments',
    attributes: {
      id,
      identifier: [
        {
          system: 'Appointment/',
          value: 'cc-external-appt-001',
        },
      ],
      kind: 'cc',
      status: 'booked',
      patientIcn: '1013125218V696863',
      locationId: '534',
      start,
      end,
      minutesDuration: 30,
      localStartTime,
      station: '534',
      location: {
        id: '534',
        name: 'Cheyenne VA Medical Center',
      },
      communityCareProvider: {
        providerName: 'Community Care Provider',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
        },
      },
      // No travelPayClaim — lets you test creating a new claim and uploading PoA from scratch
    },
  };
}

module.exports = {
  generateAppointmentDates,
  buildVaosAppointmentFromClaim,
  buildAppointmentsFromClaims,
  buildCCAppointment,
};
