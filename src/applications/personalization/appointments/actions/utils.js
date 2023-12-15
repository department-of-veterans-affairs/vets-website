import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import moment from '~/applications/personalization/dashboard/utils/date-formatting/moment-tz';
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

const transformAppointment = appointment => {
  const isVideo = appointment.attributes?.kind === 'telehealth';
  const facilityStagingId = getStagingID(appointment.attributes.locationId);
  const timezone = getTimezoneBySystemId(facilityStagingId)?.timezone;
  const date = appointment.attributes.start;
  const startsAt = (timezone
    ? moment(date).tz(timezone)
    : moment(date)
  ).format();
  return {
    ...appointment.attributes,
    id: appointment.id,
    isVideo,
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
    return differenceInMilliseconds(a.startAt, b.startAt);
  });
};

const vaosV2Helpers = {
  transformAppointment,
  sortAppointments,
};

export { vaosV2Helpers, getStagingID };
