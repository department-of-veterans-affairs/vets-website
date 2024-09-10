/* eslint-disable no-plusplus */
const dateFns = require('date-fns');

const getAvailableSlots = (number = 2) => {
  const slots = [];
  const tomorrow = dateFns.addDays(dateFns.startOfDay(new Date()), 1);
  let hourFromNow = 12;
  for (let i = 0; i < number; i++) {
    const startTime = dateFns.addHours(tomorrow, hourFromNow);
    slots.push({
      end: dateFns.addMinutes(startTime, 30).toISOString(),
      id: Math.floor(Math.random() * 90000) + 10000,
      start: startTime.toISOString(),
    });
    hourFromNow++;
  }
  return slots;
};

module.exports = { getAvailableSlots };
