import { expect } from 'chai';

import { getDemographicsStatuses, isDemographicsUpToDate } from './index';

describe('Utils', () => {
  describe('demographics utils', () => {
    describe('isDemographicsUpToDate', () => {
      it('returns true when all demographics are up to date', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: false,
          demographicsConfirmedAt: new Date().toISOString(),
          nextOfKinNeedsUpdate: false,
          nextOfKinConfirmedAt: new Date().toISOString(),
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: new Date().toISOString(),
        };
        expect(isDemographicsUpToDate(patientDemographicsStatus)).to.be.true;
      });
      it('returns false when not all are not up to date', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: false,
          nextOfKinConfirmedAt: new Date().toISOString(),
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: new Date().toISOString(),
        };
        expect(isDemographicsUpToDate(patientDemographicsStatus)).to.be.false;
      });
    });
    describe('getDemographicsStatuses', () => {
      it('returns an object with the correct key value pairs with valid values', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: false,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: new Date().toISOString(),
        };
        expect(
          getDemographicsStatuses(patientDemographicsStatus),
        ).to.deep.equal({
          demographicsUpToDate: false,
          nextOfKinUpToDate: false,
          emergencyContactUpToDate: true,
        });
      });
      it('returns an object with the correct key value pairs with unsupplied or invalid values', () => {
        const patientDemographicsStatus = {
          demographicsConfirmedAt: '',
          nextOfKinNeedsUpdate: null,
          nextOfKinConfirmedAt: null,
          emergencyContactConfirmedAt: new Date().toISOString(),
        };
        expect(
          getDemographicsStatuses(patientDemographicsStatus),
        ).to.deep.equal({
          demographicsUpToDate: false,
          nextOfKinUpToDate: false,
          emergencyContactUpToDate: false,
        });
      });
      it('returns an object with the correct key value pairs with empty object', () => {
        const patientDemographicsStatus = {};
        expect(
          getDemographicsStatuses(patientDemographicsStatus),
        ).to.deep.equal({
          demographicsUpToDate: false,
          nextOfKinUpToDate: false,
          emergencyContactUpToDate: false,
        });
      });
    });
  });
});
