/* eslint-disable no-plusplus */
const dateFns = require('date-fns');

const providers = {
  '111': {
    providerName: 'Dr. Bones',
    typeOfCare: 'Physical Therapy',
    orgName: 'Stronger Bone Technologies',
    orgAddress: {
      street1: '111 Lori Ln.',
      street2: '',
      street3: '',
      city: 'New York',
      state: 'New York',
      zip: '10016',
    },
    orgPhone: '555-600-8043',
    driveTime: '7 minute drive',
    driveDistance: '8 miles',
    location: 'Stronger bone technologies bldg 2',
  },
  '222': {
    providerName: 'Dr. Peetee',
    typeOfCare: 'Physical Therapy',
    orgName: 'Physical Therapy Solutions',
    orgAddress: {
      street1: '222 John Dr.',
      street2: '',
      street3: '',
      city: 'New York',
      state: 'New York',
      zip: '10016',
    },
    orgPhone: '555-867-5309',
    driveTime: '3 minute drive',
    driveDistance: '20 miles',
    location: 'Physical Therapy Solutions World Headquarters',
  },
};

/**
 * Creates a provider object with a configurable number of slots an hour apart.
 *
 * @param {Number} numberOfSlots How many slots to create
 * @param {String} providerId The ID for the provider
 * @returns {Object} Provider object
 */
const createProviderDetails = (numberOfSlots, providerId = '111') => {
  const provider = providers[providerId];
  provider.slots = [];
  const tomorrow = dateFns.addDays(dateFns.startOfDay(new Date()), 1);
  let hourFromNow = 12;
  for (let i = 0; i < numberOfSlots; i++) {
    const startTime = dateFns.addHours(tomorrow, hourFromNow);
    provider.slots.push({
      end: dateFns.addMinutes(startTime, 30).toISOString(),
      id: Math.floor(Math.random() * 90000) + 10000,
      start: startTime.toISOString(),
    });
    hourFromNow++;
  }
  return provider;
};

module.exports = { createProviderDetails, providers };
