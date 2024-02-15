/* eslint-disable camelcase */

const HOUR_MS = 3600000;
const MIN_MS = 60000;

function offsetDate(date, hours = 0, minutes = 0) {
  const ts = date.getTime() + hours * HOUR_MS + minutes * MIN_MS;
  return new Date(ts);
}
const now = new Date(); // datetime the mock api server was refreshed
const soonStartTime = offsetDate(now, 1, -10);
const soonEndTime = offsetDate(soonStartTime, 4); // 4 hours later
const lateStartTime = offsetDate(now, 6, 30);
const lateEndTime = offsetDate(lateStartTime, 8);

// vets-api requests are camelCase, thanks to `X-Key-Inflection: camel` header
const responses = {
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': {
    data: [
      {
        id: '000',
        type: 'maintenance_windows',
        attributes: {
          externalService: 'mhv_platform',
          startTime: soonStartTime.toISOString(),
          endTime: soonEndTime.toISOString(),
          description: '',
        },
      },
      {
        id: '001',
        type: 'maintenance_windows',
        attributes: {
          externalService: 'mhv_sm',
          startTime: lateStartTime.toISOString(),
          endTime: lateEndTime.toISOString(),
          description: '',
        },
      },
    ],
  },
};

module.exports = responses;
