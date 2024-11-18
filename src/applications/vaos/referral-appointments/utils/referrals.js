/* eslint-disable camelcase */

const dateFns = require('date-fns');

const { addDays, addMonths, format } = dateFns;
/**
 * Creates a referral object relative to a start date.
 *
 * @param {String} startDate The date to base the referral around
 * @returns {Object} Referral object
 */
const createReferral = (startDate, uuid) => {
  const relativeDate = new Date(startDate);
  const mydFormat = 'yyyy-MM-dd';
  const mydWithTimeFormat = 'yyyy-MM-dd kk:mm:ss';

  return {
    ReferralCategory: 'Inpatient',
    ReferralDate: format(relativeDate, mydFormat),
    ReferralExpirationDate: format(addMonths(relativeDate, 6), mydFormat),
    ReferralLastUpdateDate: format(relativeDate, mydFormat),
    ReferralLastUpdateDateTime: format(relativeDate, mydWithTimeFormat),
    ReferralNumber: 'VA0000009880',
    ReferringFacility: 'Batavia VA Medical Center',
    ReferringProvider: '534_520824810',
    SourceOfReferral: 'Interfaced from VA',
    Status: 'Approved',
    CategoryOfCare: 'CARDIOLOGY',
    StationID: '528A4',
    Sta6: '534',
    ReferringProviderNPI: '534_520824810',
    ReferringFacilityInfo: {
      FacilityName: 'Batavia VA Medical Center',
      FacilityCode: '528A4',
      Description: 'Batavia VA Medical Center',
      Address: {
        Address1: '222 Richmond Avenue',
        City: 'BATAVIA',
        ZipCode: '14020',
      },
      Phone: '(585) 297-1000',
      Fax: '(585) 786-1258',
    },
    ReferralStatus: 'open',
    UUID: uuid,
    numberOfAppointments: 1,
  };
};

/**
 * Creates a referral array of any length.
 *
 * @param {Number} numberOfReferrals The number of referrals to create in the array
 * @param {String} baseDate The date to base the referrals around
 * @returns {Array} Referrals array
 */
const createReferrals = (numberOfReferrals = 3, baseDate) => {
  const referrals = [];
  const baseUUID = 'add2f0f4-a1ea-4dea-a504-a54ab57c68';
  for (let i = 0; i < numberOfReferrals; i++) {
    const startDate = addDays(new Date(baseDate), i);
    referrals.push(
      createReferral(startDate, `${baseUUID}${i.toString().padStart(2, '0')}`),
    );
  }
  return referrals;
};

module.exports = { createReferral, createReferrals };
