import { expect } from 'chai';

import { INIT_FORM, createInitFormAction } from './index';

describe('check-in', () => {
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
      });
    });
  });
});
