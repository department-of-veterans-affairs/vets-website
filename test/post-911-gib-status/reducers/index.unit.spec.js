import { expect } from 'chai';

import post911GIBStatus from '../../../src/js/post-911-gib-status/reducers';

const initialState = {
  enrollmentData: null,
  available: false
};

describe('post911GIBStatus reducer', () => {
  it('should handle failure to fetch enrollment information', () => {
    const state = post911GIBStatus.post911GIBStatus(
      initialState,
      { type: 'GET_ENROLLMENT_DATA_FAILURE' }
    );

    expect(state.enrollmentData).to.be.null;
    expect(state.available).to.be.false;
  });

  it('should handle a successful request for enrollment information', () => {
    const state = post911GIBStatus.post911GIBStatus(
      initialState,
      {
        type: 'GET_ENROLLMENT_DATA_SUCCESS',
        data: {
          firstName: 'Jane',
          lastName: 'Austen',
          dateOfBirth: '9/1/1980',
          vaFileNumber: '111223333'
        }
      }
    );

    expect(state.enrollmentData.firstName).to.eql('Jane');
    expect(state.available).to.be.true;
  });
});
