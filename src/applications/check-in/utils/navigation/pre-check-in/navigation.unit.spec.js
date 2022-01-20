import { expect } from 'chai';

import {
  createForm,
  getTokenFromLocation,
  PRE_CHECK_IN_FORM_PAGES,
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
  });
});
