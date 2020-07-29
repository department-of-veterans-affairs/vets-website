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
    url: '/new-express-care-request/choose-reason',
    previous: 'info',
    next: '',
  },
};
