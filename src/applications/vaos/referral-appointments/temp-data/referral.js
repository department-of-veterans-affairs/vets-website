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
const referral = {
  providerName: 'Dr. Face',
  typeOfCare: 'Dermatology',
  orgName: 'New Skin Technologies',
  orgAddress: {
    street1: '111 Lori Ln.',
    street2: '',
    street3: '',
    city: 'New York',
    state: 'New York',
    zip: '10016',
  },
  orgPhone: '555-867-5309',
  driveTime: '7 minute drive',
  driveDistance: '8 miles',
  slots: getAvailableSlots(),
  preferredDate: new Date(),
  timezone: 'America/Denver',
};

module.exports = { getAvailableSlots, referral };
