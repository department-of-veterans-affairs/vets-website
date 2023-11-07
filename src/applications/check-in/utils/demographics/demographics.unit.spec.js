import { expect } from 'chai';

import { getDemographicsStatuses } from './index';

describe('Utils', () => {
  describe('demographics utils', () => {
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
