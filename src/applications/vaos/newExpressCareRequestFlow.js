import { checkRequestLimits } from './actions/expressCare';

export default {
  home: {
    url: '/',
  },
  info: {
    url: '/new-express-care-request',
    previous: 'home',
    async next(state, dispatch) {
      const isUnderRequestLimit = await dispatch(checkRequestLimits());
      if (isUnderRequestLimit) {
        return 'reason';
      }

      return 'info';
    },
  },
  reason: {
    url: '/new-express-care-request/select-reason',
    previous: 'info',
    next: 'details',
  },
  details: {
    url: '/new-express-care-request/additional-details',
    previous: 'reason',
    next: '',
  },
};
