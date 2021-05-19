/* istanbul ignore file */
const moment = require('moment');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = () => {
  const times = [];
  const today = moment();
  const minuteSlots = ['00:00', '20:00', '40:00'];

  while (times.length < 300) {
    const daysToAdd = randomInt(1, 60);
    const date = today
      .clone()
      .add(daysToAdd, 'day')
      .format('YYYY-MM-DD');
    const hour = `0${randomInt(9, 16)}`.slice(-2);
    const minutes = minuteSlots[Math.floor(Math.random() * minuteSlots.length)];
    const startDateTime = `${date}T${hour}:${minutes}.000+00:00`;
    if (!times.includes(startDateTime)) {
      times.push(startDateTime);
    }
  }

  return times.sort().map(startDateTime => ({
    startDateTime,
    endDateTime: moment(startDateTime.replace('+00:00', ''))
      .add(20, 'minutes')
      .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
    bookingStatus: '1',
    remainingAllowedOverBookings: '3',
    availability: true,
  }));
};
