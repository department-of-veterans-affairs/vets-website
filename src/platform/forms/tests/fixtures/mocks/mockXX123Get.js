import moment from 'moment';
/* eslint-disable camelcase */

const mockXX123Get = {
  formData: {
    email: 'test@test.com',
  },
  metadata: {
    version: 0,
    returnUrl: '/first-page',
    savedAt: 1498588443698,
    expires_at: moment()
      .add(1, 'day')
      .unix(),
    last_updated: 1498588443,
  },
};

export default mockXX123Get;
