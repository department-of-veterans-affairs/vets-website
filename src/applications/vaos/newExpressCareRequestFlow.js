export default {
  home: {
    url: '/',
  },
  info: {
    url: '/new-express-care-request',
    previous: 'home',
    next: 'reason',
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
