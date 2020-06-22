import moment from 'moment';
import environment from 'platform/utilities/environment';
import {
  resetFetch,
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

export function mockAppointmentInfo({ va = [], cc = [], requests = [] }) {
  mockFetch();
  setFetchJSONResponse(global.fetch, { data: [] });
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .startOf('day')
        .toISOString()}&end_date=${moment()
        .add(13, 'months')
        .startOf('day')
        .toISOString()}&type=va`,
    ),
    { data: va },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment().format(
        'YYYY-MM-DD',
      )}&end_date=${moment()
        .add(13, 'months')
        .format('YYYY-MM-DD')}&type=cc`,
    ),
    { data: cc },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointment_requests?start_date=${moment()
        .add(-30, 'days')
        .format('YYYY-MM-DD')}&end_date=${moment().format('YYYY-MM-DD')}`,
    ),
    { data: requests },
  );
}

export function mockFacilitesFetch(ids, facilities) {
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/v1/facilities/va?ids=${ids}`),
    { data: facilities },
  );
}
