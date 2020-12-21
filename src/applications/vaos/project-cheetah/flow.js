export default {
  home: {
    url: '/',
  },
  info: {
    url: '/new-project-cheetah-booking',
    next: 'selectDate1',
  },
  selectDate1: {
    url: '/new-project-cheetah-booking/select-date-1',
    next: 'selectDate2',
  },
  selectDate2: {
    url: '/new-project-cheetah-booking/select-date-2',
    next: 'review',
  },
  review: {
    url: '/new-project-cheetah-booking/review',
    next: '',
  },
};
