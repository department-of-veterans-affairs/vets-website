/* eslint-disable camelcase */

const HOUR_MS = 3600000;
const MIN_MS = 60000;

const now = new Date(); // datetime the mock api server was refreshed
const soon = new Date(now.getTime() + HOUR_MS - MIN_MS);
const later = new Date(soon.getTime() + HOUR_MS * 4); // 4 hours later

// vets-api requests are camelCase, thanks to `X-Key-Inflection: camel` header
const responses = {
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': {
    data: [
      {
        id: '195',
        type: 'maintenance_windows',
        attributes: {
          externalService: 'mhv',
          startTime: soon.toISOString(),
          endTime: later.toISOString(),
          description: '',
        },
      },
    ],
  },
};

module.exports = responses;
