import { differenceInMilliseconds, isFuture, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  getVATimeZone,
  getTimezoneBySystemId,
} from '~/applications/personalization/dashboard/utils/date-formatting/timezone';
import environment from '~/platform/utilities/environment';

const getStagingID = facilityID => {
  if (!facilityID) {
    return facilityID;
  }

  if (environment.isProduction()) {
    return facilityID;
  }

  if (facilityID.startsWith('983')) {
    return facilityID.replace('983', '442');
  }

  if (facilityID.startsWith('984')) {
    return facilityID.replace('984', '552');
  }

  return facilityID;
};

const isFutureAppointment = appointment => {
  const apptDateTime = parseISO(appointment.attributes.start);
  return isFuture(apptDateTime);
};

const transformAppointment = appointment => {
  const isVideo = appointment.attributes?.kind === 'telehealth';
  const isUpcoming = isFutureAppointment(appointment);
  const facilityStagingId = getStagingID(appointment.attributes.locationId);
  const timezone = getTimezoneBySystemId(facilityStagingId)?.timezone;
  const date = appointment.attributes.start;
  const startsAt = timezone
    ? formatInTimeZone(parseISO(date), timezone, "yyyy-MM-dd'T'HH:mm:ssXXX")
    : parseISO(date).toISOString();

  return {
    ...appointment.attributes,
    id: appointment.id,
    isVideo,
    isUpcoming,
    startsAt,
    type: appointment.attributes?.kind,
    timeZone: getVATimeZone(facilityStagingId),
    // additionalInfo: getAdditionalInfo(appointment),
    facility: { ...appointment.attributes.location.attributes },
    providerName: appointment.attributes.location?.attributes?.name,
  };
};

const sortAppointments = appointments => {
  return appointments.sort((a, b) => {
    return differenceInMilliseconds(parseISO(a.startsAt), parseISO(b.startsAt));
  });
};

const vaosV2Helpers = {
  transformAppointment,
  sortAppointments,
};

export { vaosV2Helpers, getStagingID, isFutureAppointment };
