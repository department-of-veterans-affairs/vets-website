import { expect } from 'chai';

import {
  createForm,
  getTokenFromLocation,
  PRE_CHECK_IN_FORM_PAGES,
  URLS,
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
      it('should return all the pages when hasConfirmedDemographics is false', () => {
        const form = createForm({
          hasConfirmedDemographics: false,
        });
        // The '-1' is for not showing the emergency contact page
        expect(form.length).to.equal(PRE_CHECK_IN_FORM_PAGES.length - 1);
      });
      it('should not return the demographics, next of kin, emergency contact pages when hasConfirmedDemographics is true', () => {
        const form = createForm({ hasConfirmedDemographics: true });
        const skippedPages = [
          URLS.DEMOGRAPHICS,
          URLS.NEXT_OF_KIN,
          URLS.EMERGENCY_CONTACT,
        ];
        expect(form.length).to.equal(
          PRE_CHECK_IN_FORM_PAGES.length - skippedPages.length,
        );
        expect(form.find(page => page === URLS.DEMOGRAPHICS)).to.be.undefined;
        expect(form.find(page => page === URLS.NEXT_OF_KIN)).to.be.undefined;
        expect(form.find(page => page === URLS.EMERGENCY_CONTACT)).to.be
          .undefined;
      });
      it('should return all pages with emergency contact page', () => {
        const form = createForm({
          hasConfirmedDemographics: false,
          isEmergencyContactEnabled: true,
        });
        // The '-1' is for not showing the emergency contact page
        expect(form.length).to.equal(PRE_CHECK_IN_FORM_PAGES.length);
      });
      it('should not return the demographics, next of kin, emergency contact pages when hasConfirmedDemographics is true and isEmergencyContact is true', () => {
        const form = createForm({
          hasConfirmedDemographics: true,
          isEmergencyContactEnabled: true,
        });
        const skippedPages = [
          URLS.DEMOGRAPHICS,
          URLS.NEXT_OF_KIN,
          URLS.EMERGENCY_CONTACT,
        ];
        expect(form.length).to.equal(
          PRE_CHECK_IN_FORM_PAGES.length - skippedPages.length,
        );
        expect(form.find(page => page === URLS.DEMOGRAPHICS)).to.be.undefined;
        expect(form.find(page => page === URLS.NEXT_OF_KIN)).to.be.undefined;
        expect(form.find(page => page === URLS.EMERGENCY_CONTACT)).to.be
          .undefined;
      });
    });
  });
});
