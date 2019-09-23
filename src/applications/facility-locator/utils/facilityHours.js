import moment from 'moment';
import { forIn, upperFirst } from 'lodash';

export function buildHours(hours, shortDay = false) {
  const builtHours = [];
  const shortDays = {
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
    Sunday: 'Sun',
  };

  forIn(hours, (value, key) => {
    let day = upperFirst(key);
    if (shortDay) {
      day = shortDays[day];
    }

    let dayHours;
    if (value === 'Closed' || value === '24/7') {
      dayHours = value;
    } else {
      const hour = value.split('-').map(time => moment(time, 'hmm A'));
      dayHours = hour.map(time => time.format('h:mm A')).join(' – ');
    }

    builtHours.push(`${day}: ${dayHours}`);
  });

  return builtHours;
}
