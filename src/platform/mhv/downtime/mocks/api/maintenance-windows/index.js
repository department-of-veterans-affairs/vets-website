/* eslint-disable camelcase */

const { add, set } = require('date-fns');

const now = new Date(); // datetime the mock api server was refreshed
const soonStartTime = add(now, { minutes: 45 });
const soonEndTime = add(soonStartTime, { hours: 4 }); // 4 hours later
const lateStartTime = set(now, { hours: 6, minutes: 30, seconds: 0 });
const lateEndTime = add(lateStartTime, { hours: 8 });

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
