/* istanbul ignore file */
/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const responses = {
  'POST /vass/v0/authenticate': {
    data: {
      id: '123',
      type: 'authenticate',
      todo: 'TODO: rebuild with real mocked data',
      attributes: {
        token: '123',
      },
    },
  },
  'POST /vass/v0/TODO_GET_OTC_ENDPOINT': {
    data: {
      id: '123',
      type: 'otc',
      todo: 'TODO: rebuild with real mocked data',
      attributes: {
        otc: '123',
      },
    },
  },
};

module.exports = delay(responses, 1000);
