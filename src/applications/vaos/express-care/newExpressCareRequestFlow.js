import { fetchRequestLimits } from './redux/actions';

export default {
  home: {
    url: '/',
  },
  info: {
    url: '/new-express-care-request',
    previous: 'home',
    async next(state, dispatch) {
      const isUnderRequestLimit = await dispatch(fetchRequestLimits());
      if (isUnderRequestLimit) {
        return 'reason';
      }

      return 'requestLimit';
    },
  },
  requestLimit: {
    url: '/new-express-care-request/request-limit',
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
