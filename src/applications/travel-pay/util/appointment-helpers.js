import { addMinutes, differenceInCalendarDays, isBefore } from 'date-fns';

const timezones = require('./timezones.json');

export const getPractionerName = practitioners => {
  return `${practitioners[0].name.given?.join(' ')} ${
    practitioners[0].name?.family
  }`;
};

export function getTimezoneByFacilityId(id) {
  if (!id) {
    return null;
  }

  if (timezones[id]) {
    return timezones[id];
  }

  return timezones[id.substr(0, 3)];
}

function getAtlasLocation(appt) {
  const { atlas } = appt.telehealth;
  return {
    id: atlas.siteCode,
    resourceType: 'Location',
    address: {
      line: [atlas.address.streetAddress],
      city: atlas.address.city,
      state: atlas.address.state,
      postalCode: atlas.address.zipCode,
    },
    position: {
      longitude: atlas.address.longitude,
      latitude: atlas.address.latitude,
    },
  };
}

export function getDaysLeft(datetimeString) {
  const apptDate = new Date(datetimeString);
  const daysSinceAppt = differenceInCalendarDays(new Date(), apptDate);

  return daysSinceAppt > 30 ? 0 : 30 - daysSinceAppt;
}

/**
 * Calculate if an appointment/claim is out of bounds (more than 30 days old)
 * @param {string} dateString - ISO date string for the appointment date
 * @returns {boolean} - true if more than 30 days old, false otherwise
 */
export function calculateIsOutOfBounds(dateString) {
  if (!dateString) {
    return false;
  }

  try {
    const daysSinceAppt = differenceInCalendarDays(
      new Date(),
      new Date(dateString),
    );
    return daysSinceAppt > 30;
  } catch (error) {
    return false;
  }
}

export function isPastAppt(appointment) {
  const isVideo = appointment.kind && appointment.kind === 'telehealth';
  const threshold = isVideo ? 240 : 60;

  const TZ = getTimezoneByFacilityId(appointment.locationId);

  const startDate = TZ
    ? new Date(appointment.start).toLocaleString('en-US', {
        timeZone: TZ,
      })
    : new Date(appointment.start).toLocaleString();
  const now = TZ
    ? new Date().toLocaleString('en-US', { timeZone: TZ })
    : new Date().toLocaleString();

  return isBefore(addMinutes(new Date(startDate), threshold), new Date(now));
}

export function transformVAOSAppointment(appt) {
  // This is only used for isCompAndPen
  const serviceCategoryName = appt.serviceCategory?.[0]?.text || 'undefined';
  const isCompAndPen = serviceCategoryName === 'COMPENSATION & PENSION';

  // TODO: verify if Atlas visits are eligible
  // I think Atlas is the video visit at a VA facility
  // Which I think makes it eligible?
  const isAtlas = !!appt.telehealth?.atlas;

  const isPast = !!isPastAppt(appt);
  const daysSinceAppt = isPast
    ? differenceInCalendarDays(new Date(), new Date(appt.localStartTime))
    : null;
  const isOutOfBounds = isPast
    ? calculateIsOutOfBounds(appt.localStartTime)
    : false;

  // This property will be helpful for complex claims
  // Adding now because we might need to specifically exclude them until then?
  const isCC = appt.kind === 'cc';

  return {
    // All original appt info
    ...appt,

    // Add additional fields
    isPast,
    daysSinceAppt,
    isOutOfBounds,
    isCC,

    // These next bits are all about atlas video visits
    isAtlas,
    // TODO: this might interfere with current facility name text in the app
    // The important bit is `atlas.siteCode` which we might be able to display?
    // otherwise it's just the street address, etc.
    atlasLocation: isAtlas ? getAtlasLocation(appt) : null,

    isCompAndPen, // This might come in handy?

    practitionerName:
      appt.practitioners &&
      typeof appt.practitioners !== 'undefined' &&
      appt.practitioners.length !== 0
        ? getPractionerName(appt.practitioners)
        : undefined,
  };
}
