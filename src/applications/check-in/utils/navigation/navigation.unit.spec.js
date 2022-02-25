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
      ];
      const URLS = {
        DEMOGRAPHICS: 'contact-information',
        EMERGENCY_CONTACT: 'emergency-contact',
        NEXT_OF_KIN: 'next-of-kin',
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
        const form = updateFormPages(
          patientDemographicsStatus,
          false,
          testPages,
          URLS,
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
          false,
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
          false,
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
          false,
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
          false,
          testPages,
          URLS,
        );
        expect(form.find(page => page === URLS.DEMOGRAPHICS)).to.exist;
      });
      it('should skip a page that has been updated more than 72 hours ago but within three calendar days', () => {
        MockDate.set('2022-01-04T14:00:00.000-05:00');
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
          false,
          testPages,
          URLS,
        );
        expect(form.find(page => page === URLS.EMERGENCY_CONTACT)).to.be
          .undefined;
      });
      it('should skip a page that has been updated less than 72 hours ago', () => {
        MockDate.set('2022-01-04T06:00:00.000-05:00');
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
          false,
          testPages,
          URLS,
        );
        expect(form.find(page => page === URLS.EMERGENCY_CONTACT)).to.be
          .undefined;
      });
    });
  });
});
