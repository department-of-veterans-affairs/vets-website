import moment from 'moment';
import environment from 'platform/utilities/environment';
import { mockFetch, setFetchJSONResponse } from 'platform/testing/unit/helpers';

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

export function mockPastAppointmentInfo({ va = [], cc = [] }) {
  mockFetch();
  setFetchJSONResponse(global.fetch, { data: [] });
  const vaUrl = `${
    environment.API_URL
  }/vaos/v0/appointments?start_date=${moment()
    .startOf('day')
    .add(-3, 'months')
    .toISOString()}&end_date=${moment()
    .startOf('day')
    .toISOString()}&type=va`;

  setFetchJSONResponse(global.fetch.withArgs(vaUrl), { data: va });
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .add(-3, 'months')
        .format('YYYY-MM-DD')}&end_date=${moment().format(
        'YYYY-MM-DD',
      )}&type=cc`,
    ),
    { data: cc },
  );
}

export function mockPastAppointmentInfoOption1({ va = [], cc = [] }) {
  mockFetch();
  setFetchJSONResponse(global.fetch, { data: [] });
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment(
        moment()
          .subtract(5, 'months')
          .startOf('month')
          .format(),
      ).toISOString()}&end_date=${moment(
        moment()
          .subtract(3, 'months')
          .endOf('month')
          .format(),
      ).toISOString()}&type=va`,
    ),
    { data: va },
  );
  setFetchJSONResponse(
    global.fetch.withArgs(
      `${environment.API_URL}/vaos/v0/appointments?start_date=${moment()
        .add(-5, 'months')
        .startOf('month')
        .format('YYYY-MM-DD')}&end_date=${moment()
        .add(-2, 'months')
        .endOf('month')
        .format('YYYY-MM-DD')}&type=cc`,
    ),
    { data: cc },
  );
}

export function mockFacilitiesFetch(ids, facilities) {
  setFetchJSONResponse(
    global.fetch.withArgs(`${environment.API_URL}/v1/facilities/va?ids=${ids}`),
    { data: facilities },
  );
}
