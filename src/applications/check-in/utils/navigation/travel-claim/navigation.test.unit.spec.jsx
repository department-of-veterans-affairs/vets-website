import { expect } from 'chai';

import {
  createForm,
  getTokenFromLocation,
  TRAVEL_PAY_FORM_PAGES,
} from './index';

describe('check in', () => {
  describe('navigation utils', () => {
    describe('getTokenFromLocation', () => {
      it('returns the id of the query object of the location provided', () => {
        const location = {
          query: {
            id: 'magic',
          },
        };
        const result = getTokenFromLocation(location);
        expect(result).to.equal('magic');
      });
      it('returns undefined if location is undefined', () => {
        const location = undefined;
        const result = getTokenFromLocation(location);
        expect(result).to.be.undefined;
      });
      it('returns undefined if location.query is undefined', () => {
        const location = {
          query: undefined,
        };
        const result = getTokenFromLocation(location);
        expect(result).to.be.undefined;
      });
    });
    describe('createForm', () => {
      it('should return all the pages when initialized', () => {
        const form = createForm();
        expect(form.length).to.equal(TRAVEL_PAY_FORM_PAGES.length);
      });
    });
  });
});
