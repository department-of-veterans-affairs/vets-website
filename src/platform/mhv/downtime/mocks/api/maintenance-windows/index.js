/* eslint-disable camelcase */

const HOUR_MS = 3600000;

const now = new Date(); // datetime the mock api server was refreshed
const later = new Date(now.getTime() + HOUR_MS * 4); // 4 hours later

const responses = {
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': {
    data: [
      {
        id: '195',
        type: 'maintenance_windows',
        attributes: {
          external_service: 'mhv_platform',
          start_time: now.toISOString(),
          end_time: later.toISOString(),
          description: '',
        },
      },
    ],
  },
};

module.exports = responses;
