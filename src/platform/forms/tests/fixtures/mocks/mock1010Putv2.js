import moment from 'moment';
/* eslint-disable camelcase */

const mock1010Putv2 = {
  data: {
    attributes: {
      metadata: {
        version: 0,
        returnUrl: '/first-page',
        savedAt: 1498588443698,
        expires_at: moment()
          .add(1, 'day')
          .unix(),
        last_updated: 1498588443,
      },
    },
  },
};

export default mock1010Putv2;
