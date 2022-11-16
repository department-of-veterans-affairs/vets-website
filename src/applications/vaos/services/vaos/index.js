import appendQuery from 'append-query';
import moment from 'moment';
import { fetchAppointments } from '../appointment';
import { apiRequestWithUrl, parseApiList, parseApiObject } from '../utils';

const acheronHeader = {
  headers: { ACHERON_REQUESTS: 'true' },
};
export function postAppointment(appointment, useAcheron) {
  return apiRequestWithUrl(
    '/vaos/v2/appointments',
    !useAcheron
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointment),
        }
      : {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...acheronHeader.headers,
          },
          body: JSON.stringify(appointment),
        },
  ).then(parseApiObject);
}

export function putAppointment(id, appointment, useAcheron) {
  return apiRequestWithUrl(
    `/vaos/v2/appointments/${id}`,
    !useAcheron
      ? {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointment),
        }
      : {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...acheronHeader.headers,
          },
          body: JSON.stringify(appointment),
        },
  ).then(parseApiObject);
}

export function getAppointments(start, end, statuses = [], useAcheron) {
  const options = {
    method: 'GET',
  };
  return apiRequestWithUrl(
    `/vaos/v2/appointments?_include=facilities,clinics&start=${start}&end=${end}&${statuses
      .map(status => `statuses[]=${status}`)
      .join('&')}`,
    !useAcheron ? options : { ...options, ...acheronHeader },
  ).then(parseApiList);
}

export function getAppointment(id, useAcheron) {
  const options = {
    method: 'GET',
  };
  return apiRequestWithUrl(
    `/vaos/v2/appointments/${id}?_include=facilities,clinics`,
    !useAcheron ? options : { ...options, ...acheronHeader },
  ).then(parseApiObject);
}

export function getFacilities(ids, children = false) {
  return apiRequestWithUrl(
    `/vaos/v2/facilities?children=${children}&${ids
      .map(id => `ids[]=${id}`)
      .join('&')}`,
  ).then(parseApiList);
}

export function getClinics({ locationId, clinicIds, typeOfCareId }) {
  const url = `/vaos/v2/locations/${locationId}/clinics`;
  return apiRequestWithUrl(
    appendQuery(
      url,
      // eslint-disable-next-line camelcase
      { clinic_ids: clinicIds, clinical_service: typeOfCareId },
      { removeNull: true },
    ),
  ).then(parseApiList);
}

export function getPatientEligibility(
  locationId,
  typeOfCareId,
  schedulingType,
) {
  return apiRequestWithUrl(
    `/vaos/v2/eligibility?facility_id=${locationId}&clinical_service_id=${typeOfCareId}&type=${schedulingType}`,
  ).then(parseApiObject);
}

export function getFacilityById(id) {
  return apiRequestWithUrl(`/vaos/v2/facilities/${id}`).then(parseApiObject);
}

export function getSchedulingConfigurations(locationIds, ccEnabled = null) {
  let ccEnabledParam = '';
  if (ccEnabled !== null) {
    ccEnabledParam = `&cc_enabled=${ccEnabled}`;
  }

  return apiRequestWithUrl(
    `/vaos/v2/scheduling/configurations?${locationIds
      .map(id => `facility_ids[]=${id}`)
      .join('&')}${ccEnabledParam}`,
    {
      method: 'GET',
    },
  ).then(parseApiList);
}

export function getAvailableV2Slots(facilityId, clinicId, startDate, endDate) {
  return apiRequestWithUrl(
    `/vaos/v2/locations/${facilityId}/clinics/${clinicId}/slots?start=${startDate}&end=${endDate}`,
  ).then(parseApiList);
}
export const getLongTermAppointmentHistoryV2 = ((chunks = 1, useAcheron) => {
  const batch = [];
  let promise = null;

  return () => {
    if (!promise || navigator.userAgent === 'node.js') {
      // Creating an array of start and end dates for each chunk
      const ranges = Array.from(Array(chunks).keys()).map(i => {
        return {
          start: moment()
            .startOf('day')
            .subtract(i + 1, 'year')
            .utc()
            .format(),

          end: moment()
            .startOf('day')
            .subtract(i, 'year')
            .utc()
            .format(),
        };
      });

      // There are three chunks with date ranges from the array created above.
      // We're trying to run them serially, because we want to be careful about
      // overloading the upstream service, so Promise.all doesn't fit here.
      promise = ranges.reduce(async (prev, curr) => {
        // NOTE: This is the secret sauce to run the fetch requests sequentially.
        // Doing an 'await' on a non promise wraps it into a promise that is then awaited.
        // In this case, the initial value of previous is set to an empty array.
        //
        // NOTE: fetchAppointments will run concurrently without this await 1st!
        await prev;

        // Next, fetch the appointments which will be chained which the previous await
        const p1 = await fetchAppointments({
          startDate: curr.start,
          endDate: curr.end,
          useV2VA: true,
          useV2CC: true,
          useAcheron,
        });
        batch.push(p1);
        return Promise.resolve([...batch].flat());
      }, []);
    }

    return promise;
  };
})(3);

export function getPreferredCCProvider(id) {
  return apiRequestWithUrl(`/vaos/v2/providers/${id}`, {
    method: 'GET',
  }).then(parseApiObject);
}
