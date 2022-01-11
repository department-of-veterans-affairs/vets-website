import { expect } from 'chai';

import {
  createForm,
  getTokenFromLocation,
  PRE_CHECK_IN_FORM_PAGES,
  URLS,
  updateForm,
} from './index';

describe('Pre-check in', () => {
  describe('navigation utils', () => {
    describe('getTokenFromLocation', () => {
      it('returns id from the query', () => {
        const location = {
          query: { id: '123' },
        };
        expect(getTokenFromLocation(location)).to.equal('123');
      });
      it('returns undefined if the query is falsy', () => {
        const location = {
          query: undefined,
        };
        expect(getTokenFromLocation(location)).to.be.undefined;
      });
      it('returns undefined if the location is falsy', () => {
        expect(getTokenFromLocation(null)).to.be.undefined;
      });
    });
    describe('createForm', () => {
      it('should return all the pages when initialized', () => {
        const form = createForm();
        expect(form.length).to.equal(PRE_CHECK_IN_FORM_PAGES.length);
      });
    });
    describe('updateForm', () => {
      const now = Date.now();
      const today = new Date(now);

      it('should return all pages with emergency contact page', () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: true,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const form = updateForm(patientDemographicsStatus, true);
        expect(form.length).to.equal(PRE_CHECK_IN_FORM_PAGES.length);
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
        const form = updateForm(patientDemographicsStatus, true);
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
        const form = updateForm(patientDemographicsStatus, true);
        expect(form.find(page => page === URLS.NEXT_OF_KIN)).to.exist;
      });
      it("should not skip a page that hasn't been updated within the time window", () => {
        const patientDemographicsStatus = {
          demographicsNeedsUpdate: true,
          demographicsConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          nextOfKinNeedsUpdate: true,
          nextOfKinConfirmedAt: '2022-01-04T00:00:00.000-05:00',
          emergencyContactNeedsUpdate: false,
          emergencyContactConfirmedAt: '2021-12-01T00:00:00.000-05:00',
        };
        const form = updateForm(patientDemographicsStatus, true);
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
        const form = updateForm(patientDemographicsStatus, true);
        expect(form.find(page => page === URLS.DEMOGRAPHICS)).to.exist;
      });
    });
  });
});
