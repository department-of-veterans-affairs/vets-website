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
  id: 123456,
  providerName: 'Dr. Face',
  typeOfCare: 'Dermatology',
  appointmentCount: 2,
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
  expirationDate: dateFns.addDays(new Date(), 30),
  location: 'New skin technologies bldg 2',
  referralNumber: '1234567890',
  referringFacility: {
    name: 'Syracuse VA Medical Center',
    phone: '555-555-5555',
  },
};
referral.slots.push({
  end: '2024-11-22T16:30:00.000Z',
  id: 35145,
  start: '2024-11-22T16:00:00.000Z',
});
module.exports = { getAvailableSlots, referral };
