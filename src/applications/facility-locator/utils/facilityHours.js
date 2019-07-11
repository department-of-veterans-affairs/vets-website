import moment from 'moment';
import { forIn, upperFirst } from 'lodash';

export function buildHours(hours) {
  const builtHours = [];

  forIn(hours, (value, key) => {
    const day = upperFirst(key);

    let dayHours;
    if (value === 'Closed' || value === '24/7') {
      dayHours = value;
    } else {
      const hour = value.split('-').map(time => moment(time, 'hmmA'));
      dayHours = hour.map(time => time.format('h:mmA')).join(' - ');
    }

    builtHours.push(`${day}: ${dayHours}`);
  });

  return builtHours;
}
