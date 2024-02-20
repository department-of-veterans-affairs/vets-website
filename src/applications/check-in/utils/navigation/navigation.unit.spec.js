import { expect } from 'chai';
import MockDate from 'mockdate';

import { updateFormPages } from './index';

describe('Global check in', () => {
  describe('navigation utils', () => {
    describe('updateFormPages', () => {
      afterEach(() => {
        MockDate.reset();
      });

      const now = Date.now();
      const today = new Date(now);
      const testPages = [
        'contact-information',
        'next-of-kin',
        'emergency-contact',
        'travel-pay',
        'travel-vehicle',
        'travel-address',
        'travel-mileage',
      ];
      const URLS = {
        DEMOGRAPHICS: 'contact-information',
        EMERGENCY_CONTACT: 'emergency-contact',
        NEXT_OF_KIN: 'next-of-kin',
        TRAVEL_QUESTION: 'travel-pay',
        TRAVEL_VEHICLE: 'travel-vehicle',
        TRAVEL_ADDRESS: 'travel-address',
        TRAVEL_MILEAGE: 'travel-mileage',
      };
      it('should return all pages with emergency contact page', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: true,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const isTravelReimbursementEnabled = true;
        const appointments = [
          {
            stationNo: '0001',
            clinicIen: '0001',
          },
        ];
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
          isTravelReimbursementEnabled,
          appointments,
        );
        expect(form.length).to.equal(testPages.length);
      });
      it("should skip a page that has been updated within the time window and isn't flagged for an update", () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: false,
          demographicsConfirmedAt: today.toISOString(),
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
        );
        expect(form.find(page => page === URLS.DEMOGRAPHICS)).to.be.undefined;
      });
      it('should not skip a page that has been updated within the time window but is flagged for an update', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: today.toISOString(),
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
        );
        expect(form.find(page => page === URLS.NEXT_OF_KIN)).to.exist;
      });
      it("should not skip a page that hasn't been updated within the time window", () => {
        MockDate.set('2022-01-05T14:00:00.000-05:00');
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
        );
        expect(form.find(page => page === URLS.EMERGENCY_CONTACT)).to.exist;
      });
      it('should not skip a page that has no last updated date string', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: false,
          demographicsConfirmedAt: null,
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
        );
        expect(form.find(page => page === URLS.DEMOGRAPHICS)).to.exist;
      });
      it('should skip a page that has been updated more than 168 hours ago but within seven calendar days', () => {
        MockDate.set('2022-01-08T14:00:00.000-05:00');
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: '2022-01-01T08:00:00.000-05:00',
        };
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
        );
        expect(form.find(page => page === URLS.EMERGENCY_CONTACT)).to.be
          .undefined;
      });
      it('should skip a page that has been updated less than 168 hours ago', () => {
        MockDate.set('2022-01-08T06:00:00.000-05:00');
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: '2022-01-01T08:00:00.000-05:00',
        };
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
        );
        expect(form.find(page => page === URLS.EMERGENCY_CONTACT)).to.be
          .undefined;
      });
      it('should skip travel pages if appointments are greater than 1', () => {
        MockDate.set('2022-01-08T06:00:00.000-05:00');
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: false,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: false,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: '2022-01-01T08:00:00.000-05:00',
        };
        const isTravelReimbursementEnabled = true;
        const appointments = [
          { stationNo: '0001' },
          { stationNo: '0001' },
          { stationNo: '0001' },
          { stationNo: '0001' },
        ];
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
          isTravelReimbursementEnabled,
          appointments,
        );
        expect(form.find(page => page === URLS.TRAVEL_PAY)).to.be.undefined;
        expect(form.find(page => page === URLS.TRAVEL_VEHICLE)).to.be.undefined;
        expect(form.find(page => page === URLS.TRAVEL_ADDRESS)).to.be.undefined;
        expect(form.find(page => page === URLS.TRAVEL_MILEAGE)).to.be.undefined;
      });
      it('should show travel pages if there is only one appointment', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: true,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const isTravelReimbursementEnabled = true;
        const appointments = [
          {
            stationNo: '0001',
            clinicIen: '0001',
          },
        ];
        expect(appointments).to.have.lengthOf(1);
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
          isTravelReimbursementEnabled,
          appointments,
        );
        expect(form.find(page => page === URLS.TRAVEL_QUESTION)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_VEHICLE)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_ADDRESS)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_MILEAGE)).to.exist;
      });
      it('should skip travel pages if facility is in local storage within the last day', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: true,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const isTravelReimbursementEnabled = true;
        const appointments = [
          { stationNo: '0001', clinicIen: '0001', facility: 'testId' },
        ];
        expect(appointments).to.have.lengthOf(1);
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
          isTravelReimbursementEnabled,
          appointments,
          true,
          { '0001': new Date().toISOString() },
        );
        expect(form.find(page => page === URLS.TRAVEL_PAY)).to.be.undefined;
        expect(form.find(page => page === URLS.TRAVEL_VEHICLE)).to.be.undefined;
        expect(form.find(page => page === URLS.TRAVEL_ADDRESS)).to.be.undefined;
        expect(form.find(page => page === URLS.TRAVEL_MILEAGE)).to.be.undefined;
      });
      it('should not skip travel pages if facility is in local storage but not in the last day', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: true,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const isTravelReimbursementEnabled = true;
        const appointments = [
          { stationNo: '0001', clinicIen: '0001', facility: 'testId' },
        ];
        expect(appointments).to.have.lengthOf(1);
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
          isTravelReimbursementEnabled,
          appointments,
          true,
          { '0001': new Date('2023-01-01T03:24:00').toISOString() },
        );
        expect(form.find(page => page === URLS.TRAVEL_QUESTION)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_VEHICLE)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_ADDRESS)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_MILEAGE)).to.exist;
      });
      it('should not skip travel pages if facility is not in local storage and there are multiple appointments', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: true,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const isTravelReimbursementEnabled = true;
        const appointments = [
          { stationNo: '0001', clinicIen: '0001', facility: 'testId' },
          { stationNo: '0001', clinicIen: '0001', facility: 'testId' },
        ];
        expect(appointments).to.have.lengthOf(2);
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
          isTravelReimbursementEnabled,
          appointments,
          true,
          {},
        );
        expect(form.find(page => page === URLS.TRAVEL_QUESTION)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_VEHICLE)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_ADDRESS)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_MILEAGE)).to.exist;
      });
      it('should not skip travel pages if different facility is in local storage within the last day', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: true,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const isTravelReimbursementEnabled = true;
        const appointments = [
          { stationNo: '0001', clinicIen: '0001', facility: 'testId' },
        ];
        expect(appointments).to.have.lengthOf(1);
        const form = updateFormPages(
          patientDemographicsStatus,
          testPages,
          URLS,
          isTravelReimbursementEnabled,
          appointments,
          true,
          { '0002': new Date().toISOString() },
        );
        expect(form.find(page => page === URLS.TRAVEL_QUESTION)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_VEHICLE)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_ADDRESS)).to.exist;
        expect(form.find(page => page === URLS.TRAVEL_MILEAGE)).to.exist;
      });
    });
  });
});
