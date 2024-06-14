import { expect } from 'chai';

import reducer from './index';

describe('check in', () => {
  describe('reducer', () => {
    describe('initial state and default actions', () => {
      it('should return the init state with no action', () => {
        const state = reducer.checkInData(undefined, {});
        expect(state).to.deep.equal({
          app: '',
          appointments: [],
          veteranData: {
            demographics: {},
            address: '',
          },
          context: {},
          form: {
            pages: [],
            data: {},
          },
          error: '',
        });
      });
      it('should return the state if action is not found', () => {
        const mockState = {
          a: 1,
          b: 2,
          c: 3,
        };
        const state = reducer.checkInData(mockState, {});
        expect(state).to.deep.equal(mockState);
      });
    });
  });
});
