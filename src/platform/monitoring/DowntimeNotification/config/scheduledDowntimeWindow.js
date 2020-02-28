import moment from 'moment';

// Times should always have Eastern time offset.
export default {
  downtimeStart: moment.parseZone('2020-02-29T21:00:00-05:00'),
  downtimeEnd: moment.parseZone('2020-02-29T21:30:00-05:00'),
};
