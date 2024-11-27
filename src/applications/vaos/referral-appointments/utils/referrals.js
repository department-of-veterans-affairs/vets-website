/* eslint-disable camelcase */

const { addDays, addMonths, format } = require('date-fns');

/**
 * Creates a referral object relative to a start date.
 *
 * @param {String} startDate The date to base the referral around
 * @returns {Object} Referral object
 */
const createReferral = (startDate, uuid) => {
  const [year, month, day] = startDate.split('-');
  const relativeDate = new Date(year, month - 1, day);

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
    CategoryOfCare: 'Cardiology',
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
    providerName: 'Dr. Face',
    providerLocation: 'New skin technologies bldg 2',
  };
};

/**
 * Creates a referral array of any length.
 *
 * @param {Number} numberOfReferrals The number of referrals to create in the array
 * @param {String} baseDate The date in 'yyyy-MM-dd' format to base the referrals around
 * @returns {Array} Referrals array
 */
const createReferrals = (numberOfReferrals = 3, baseDate) => {
  const [year, month, day] = baseDate.split('-');
  const baseDateObject = new Date(year, month - 1, day);
  const referrals = [];
  const baseUUID = 'add2f0f4-a1ea-4dea-a504-a54ab57c68';
  for (let i = 0; i < numberOfReferrals; i++) {
    const startDate = addDays(baseDateObject, i);
    const mydFormat = 'yyyy-MM-dd';
    const referralDate = format(startDate, mydFormat);
    referrals.push(
      createReferral(
        referralDate,
        `${baseUUID}${i.toString().padStart(2, '0')}`,
      ),
    );
  }
  return referrals;
};

module.exports = { createReferral, createReferrals };
