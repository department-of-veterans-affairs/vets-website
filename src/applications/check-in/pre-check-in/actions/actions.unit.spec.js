import { expect } from 'chai';

import {
  INIT_FORM,
  createInitFormAction,
  GO_TO_NEXT_PAGE,
  createGoToNextPageAction,
} from './index';

describe('pre-check-in', () => {
  describe('actions', () => {
    describe('createInitFormAction', () => {
      it('should return correct action', () => {
        const action = createInitFormAction({});
        expect(action.type).to.equal(INIT_FORM);
      });
      it('should return correct structure', () => {
        const action = createInitFormAction({
          pages: ['first-page', 'second-page'],
          firstPage: 'first-page',
        });
        expect(action.payload.pages).to.be.an('array');
        expect(action.payload.pages).to.deep.equal([
          'first-page',
          'second-page',
        ]);
        expect(action.payload.currentPage).to.equal('first-page');
      });
    });
    describe('createGoToNextPageAction', () => {
      it('should return correct action', () => {
        const action = createGoToNextPageAction({});
        expect(action.type).to.equal(GO_TO_NEXT_PAGE);
      });
      it('should return correct structure', () => {
        const action = createGoToNextPageAction({
          nextPage: 'next-page',
        });
        expect(action.payload.nextPage).equal('next-page');
      });
    });
  });
});
