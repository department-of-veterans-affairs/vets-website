import moment from 'moment';
import momentTimezone from 'moment-timezone';

// Derive moment options.
const options = {
  meridiem: hour => {
    if (hour < 12) {
      return 'a.m.';
    }
    return 'p.m.';
  },
  monthsShort: [
    'Jan.',
    'Feb.',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.',
  ],
};

// Called at startup so that the formatting applied under updateLocale occur site-wide.
moment.updateLocale('en', options);
momentTimezone.updateLocale('en', options);
