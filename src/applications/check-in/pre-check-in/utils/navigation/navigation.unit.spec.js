import { expect } from 'chai';

import { createForm, PRE_CHECK_IN_FORM_PAGES, URLS } from './index';

describe('Pre-check in', () => {
  describe('navigation utils', () => {
    describe('createForm', () => {
      it('should return all the pages when hasConfirmedDemographics is false', () => {
        const form = createForm({ hasConfirmedDemographics: false });
        expect(form.length).to.equal(PRE_CHECK_IN_FORM_PAGES.length);
      });
      it('should not return the demographics or next of kin pages the pages when hasConfirmedDemographics is true', () => {
        const form = createForm({ hasConfirmedDemographics: true });
        expect(form.length).to.equal(PRE_CHECK_IN_FORM_PAGES.length - 2);
        expect(form.find(page => page.url === URLS.DEMOGRAPHICS)).to.be
          .undefined;
        expect(form.find(page => page.url === URLS.NEXT_OF_KIN)).to.be
          .undefined;
      });
    });
  });
});
