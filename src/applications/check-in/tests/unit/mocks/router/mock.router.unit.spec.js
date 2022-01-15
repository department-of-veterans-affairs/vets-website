import { expect } from 'chai';

import { createMockRouter } from './index';

describe('Pre check in', () => {
  describe('unit test utils', () => {
    describe('createMockRouter', () => {
      it('returns an object with push as a function, location and params as an object', () => {
        const result = createMockRouter();
        expect(result.push).to.be.a('function');
        expect(result.location).to.be.an('object');
        expect(result.params).to.be.an('object');
      });
      it('should return custom push function that was passed in', () => {
        const push = () => {};
        const result = createMockRouter({ push });
        expect(result.push).to.equal(push);
      });
      it('returns location with a pathname that was passed at the currentPage', () => {
        const currentPage = '/test';
        const result = createMockRouter({ currentPage });
        expect(result.location.pathname).to.equal(currentPage);
      });
      it('adds a leading / to currentPage', () => {
        const currentPage = 'test';
        const result = createMockRouter({ currentPage });
        expect(result.location.pathname).to.equal(`/${currentPage}`);
      });
    });
  });
});
