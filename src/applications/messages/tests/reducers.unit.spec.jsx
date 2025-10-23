import { expect } from 'chai';

import { inquiryReducer } from '../reducers/inquiryReducer';

describe('inquiry reducer', () => {
  describe('FETCH_INQUIRIES_SUCCESS', () => {
    it('updates state with inquiries data', () => {
      const action = {
        type: 'FETCH_INQUIRIES_SUCCESS',
        data: 'fake data',
      };
      const resultState = inquiryReducer({}, action);
      expect(resultState.data).to.equal('fake data');
    });
  });
});
